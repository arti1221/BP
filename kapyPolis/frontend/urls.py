from django.urls import path
from .views import index

urlpatterns = [
    path('', index), # homePage
    path('join', index), # joinPage
    path('/create', index) # createPage
]