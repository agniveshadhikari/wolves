from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('acquire-token', TokenObtainPairView.as_view(), name='getToken'),
    path('refresh-token', TokenRefreshView.as_view(), name='refreshToken'),
]