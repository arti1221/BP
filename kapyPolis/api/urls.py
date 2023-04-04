from django.urls import path
from views import RoomView, CreateRoomView, GetRoomView, JoinRoomView, UsersRoomView, LeaveRoomView, UpdateRoomView, TemplateView, CreateTemplateView, ShopItemsView, CreateShopItemsView

urlpatterns = [
    # ROOM Req.
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoomView.as_view()),
    path('join-room', JoinRoomView.as_view()),
    path('users-room', UsersRoomView.as_view()),
    path('leave-room', LeaveRoomView.as_view()),
    path('update-room', UpdateRoomView.as_view()),
    # Template Req. 
    path('template', TemplateView.as_view()),
    path('create-template', CreateTemplateView.as_view()),
    # add a getter
    # Shop Items.
    path('shop-items', ShopItemsView.as_view()),
    path('create-shop-items', CreateShopItemsView.as_view()),
]