# urls for API's local to this app

from django.urls import path, include
from .views import RoomView

urlpatterns = [
    path('home', RoomView.as_view()), # redirects to api.urls
]