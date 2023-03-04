from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
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
