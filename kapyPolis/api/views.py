from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from django.shortcuts import redirect
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import Room
from api.serializers import RoomSerializer, CreateRoomSerializer


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


@method_decorator(csrf_protect, name='dispatch')
class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # Set CSRF token in response
        response = Response()
        response['X-CSRFToken'] = get_token(request)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            max_players = serializer.data.get('max_players')
            host = self.request.session.session_key

            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.max_players = max_players
                room.save(update_fields=['max_players'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, max_players=max_players)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST, headers=response)

class GetRoomView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code' # pass a param 

    def get(self, req, format=None):
        code = req.GET.get(self.lookup_url_kwarg) # get request for param code
        if (code != None):
            room = Room.objects.filter(code=code)
            if (len(room)):
                data = RoomSerializer(room[0]).data # serializing and accessing the room, getting the first one and extracting it's data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room does not exist': 'Invalid data...'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Code param is invalid...'}, status=status.HTTP_400_BAD_REQUEST)
    

# ROOM JOINING:

class JoinRoomView(APIView):
    lookup_url_kwarg = 'code'
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        code = request.data.get('code', None)
        if code is not None:
            room = Room.objects.filter(code=code).first()
            if room is not None:
                serializer = RoomSerializer(room)
                if room.current_players < room.max_players:
                    room.current_players += 1
                    room.save(update_fields=['current_players'])
                    return Response(serializer.data)
                else:
                    return Response({'Room is Full': 'Cannot Join Room.'}, status=status.HTTP_403_FORBIDDEN)
            else:
                return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)

class UsersRoomView(APIView): # to differentiate whether the player is in the room or not so he can not be in 2 rooms in the same time
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code' : self.request.session.get('room_code')
        }
        return JsonResponse(data=data, status=status.HTTP_200_OK) # json serializer that takes dict instead of obj or db model
    
    # WORKING!!
# class LeaveRoomView(APIView):
#     def post(self, request, format=None):
#         if 'room_code' in self.request.session:
#             room_code = self.request.session['room_code']
#             self.request.session.pop('room_code')
#             try:
#                 room = Room.objects.get(code=room_code)
#                 room.current_players -= 1
#                 if room.current_players < 1:
#                     room.delete()
#                 else:
#                     if room.id is None:
#                         room.save()
#                     else:
#                         room.save(update_fields=['current_players'])
#                 return Response({'success': 'Left the room'}, status=status.HTTP_200_OK)
#             except Room.DoesNotExist:
#                 pass
#         return Response({'Bad Request': 'Invalid Data...'}, status=status.HTTP_400_BAD_REQUEST)
        


class LeaveRoomView(APIView):
  def post(self, request, format=None):
    print("SOM TU")
    print(request.data)
    if "code" in request.data:
      room_code = request.data["code"]
      try:
        room = Room.objects.get(code=room_code)
        room.current_players -= 1
        if room.current_players < 1:
          room.delete()
          return Response(
            {
              "success": "Left the room and room has been deleted",
              "redirect_url": "/",
            },
            status=status.HTTP_200_OK,
          )
        else:
          if room.id is None:
            room.save()
          else:
            room.save(update_fields=["current_players"])
        return Response({"success": "Left the room"}, status=status.HTTP_200_OK)
      except Room.DoesNotExist:
        pass
    return Response({"Bad Request": "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)


