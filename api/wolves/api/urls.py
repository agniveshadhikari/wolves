from django.urls import path
from .views import RoomViewSet

urlpatterns = [
    # Room create
    path('rooms', RoomViewSet.as_view({'post': 'create'}), name='room_create'),

    # Room state
    path('rooms/<str:room_name>', RoomViewSet.as_view({'get': 'retrieve'}), name='room_retrieve'),

    # Room exists
    path('rooms/<str:room_name>/exists', RoomViewSet.as_view({'get': 'exists'}), name='room_exists'),

    # Room assign
    path('rooms/<str:room_name>/assign', RoomViewSet.as_view({'post': 'assign'}), name='room_assign'),
]