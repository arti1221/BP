from django.urls import path
from views import RoomView, CreateRoomView, GetRoomView, JoinRoomView, UsersRoomView, LeaveRoomView, UpdateRoomView, TemplateView, CreateTemplateView, ShopItemsView, CreateShopItemsView, GetTemplateView, PlayersView, RemovePlayerView, StartGameView, UserView, RegisterUserView, AuthorizeUser, GetAllTemplatesView, GetAuthorTemplatesView, UpdateTemplateView, SetPlayersBalanceView, GetRoomSessions, UpdateGameTurnView, UpdatePlayerView, GetRoomPlayersView, LogView, UpdateLogView, GetLogView

urlpatterns = [
    # ROOM Req.
    path('room', RoomView.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('get-room', GetRoomView.as_view()),
    path('join-room', JoinRoomView.as_view()),
    path('users-room', UsersRoomView.as_view()),
    path('leave-room', LeaveRoomView.as_view()),
    path('update-room', UpdateRoomView.as_view()),
    path('start-game', StartGameView.as_view()),
    # Template Req. 
    path('template', TemplateView.as_view()),
    path('create-template', CreateTemplateView.as_view()),
    path('get-template', GetTemplateView.as_view()),
    path('get-all-templates', GetAllTemplatesView.as_view()),
    path('get-author-templates', GetAuthorTemplatesView.as_view()),
    path('update-template', UpdateTemplateView.as_view()),
    # add a getter
    # Shop Items.
    path('shop-items', ShopItemsView.as_view()),
    path('create-shop-items', CreateShopItemsView.as_view()),
    # players
    path('players', PlayersView.as_view()),
    path('set-players-balance', SetPlayersBalanceView.as_view()),
    path('update-player', UpdatePlayerView.as_view()),
    path('get-room-players', GetRoomPlayersView.as_view()),
    path('delete-player', RemovePlayerView.as_view()),
    path('get-room-sessions', GetRoomSessions.as_view()),
    # users
    path('users', UserView.as_view()),
    path('register', RegisterUserView.as_view()),
    path('authorize', AuthorizeUser.as_view()),
    # game
    path('update-turn', UpdateGameTurnView.as_view()),
    # logs
    path('log', LogView.as_view()),
    path('update-log', UpdateLogView.as_view()),
    path('get-log', GetLogView.as_view()),
]