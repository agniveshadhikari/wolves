from django.urls import include, path
from . import views

urlpatterns = [
    # UI Bundle
    path('', views.IndexView.as_view(), name='index'),

    # Check if no-spa
    path('no-spa/', include('wolves.ui.urls')),

    # Rest are rest api
    path('', include('wolves.api.urls'))
]