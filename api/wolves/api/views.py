from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from django.shortcuts import get_object_or_404
from django.http import HttpResponseForbidden
from ..models import Room, Player
from .serializers import RoomSerializer
from .permissions import IsInRoom
from ..assign import assign as assignRoles

class RoomViewSet(viewsets.ViewSet):
    permission_classes = [
        IsAuthenticated,
        IsInRoom
    ]

    def create(self, request):
        if Room.objects.filter(name=request.data["name"]).exists():
            return Response({ "message": "Room with this name already exists"}, status=409)

        if not hasattr(request.user, 'player'):
            return Response({ "message": "User doesn't have a player profile"}, status=400)

        request.user.player.room = Room.objects.create(name=request.data["name"])
        request.user.player.role = 1
        request.user.player.save()

        serializer = RoomSerializer(
            request.user.player.room, context={'player': request.user.player})

        return Response(serializer.data)

    def retrieve(self, request, room_name):
        room = get_object_or_404(Room.objects.all(), name=room_name)
        self.check_object_permissions(request, room)
        serializer = RoomSerializer(
            room, context={'player': request.user.player})
        return Response(serializer.data)

    def exists(self, request, room_name):
        try:
            Room.objects.get(name=room_name)
        except Room.DoesNotExist:
            return Response({"name": room_name, "exists": False})
        
        return Response({"name": room_name, "exists": True})

    def assign(self, request, room_name):
        # TODO make IsMod permission class
        if request.user.player.is_moderator():
            room = get_object_or_404(Room.objects.all(), name=room_name)
            player_count = len(Player.objects.filter(room=room))
            if player_count < 5:
                return Response({"message": "Less than 5 players"}, status=400)

            wolves = player_count//3
            player_count -= wolves

            seer = 1
            player_count -= seer

            doctor = 1
            player_count -= doctor

            villagers = player_count

            role_dict = {
                2: doctor,
                3: seer,
                4: wolves,
                5: villagers
            }
            assignRoles(Room.name, role_dict)
            return Response({"assigned": True})

        else:
            return HttpResponseForbidden()
