from django.urls import path
from .views import index

urlpatterns = [
    path('', index), # homePage
    path('join', index), # joinPage for room
    path('create', index), # createPage for room
    path('room/<str:roomCode>', index), # to set up dynamic url as String.
    path('template', index), # template page
    path("template/<str:name>", index),
    path('help', index), # help page
    path('create-user', index),
    path('login', index),
]