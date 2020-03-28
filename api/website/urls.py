from django.contrib import admin
from django.urls import include, path
from core import views as core_views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('auth/', include('core.urls')),
    path('admin/', admin.site.urls),
    path('', include('wolves.urls')),


    path('signup/', core_views.signup, name='signup'),
    path('signin/', auth_views.LoginView.as_view(template_name="core/signin.html"), name="signin"),
    path('signout/', auth_views.LogoutView.as_view(template_name="core/signout.html"), name="signout"),
]