from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse, HttpResponseNotFound
from django.shortcuts import redirect
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404
from api.models import Room, Template
from api.serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer, TemplateSerializer,CreateTemplateSerializer
from rest_framework.parsers import MultiPartParser

# TODO: if response 400 or bad, throw exception to go to catch blyat :)

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
                data['is_host'] = self.request.session.session_key == room[0].host # to differenciate whether this is the host(admin) or not
                return Response(data, status=status.HTTP_200_OK)
            raise Http404("Room does not exist.")
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
        print('HERE')
        if (Room.objects.filter(code=self.request.session.get('room_code')).first() is None):
           print('here :)')
           raise Http404("Room does not exist.")
        return JsonResponse(data=data, status=status.HTTP_200_OK) # json serializer that takes dict instead of obj or db model

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

class UpdateRoomView(APIView):
   serializer_class = UpdateRoomSerializer

   def patch(self, request, format=None):
      if not self.request.session.exists(self.request.session.session_key):
        self.request.session.create()
      serializer = self.serializer_class(data=self.request.data)
      if (serializer.is_valid()):
        code = serializer.data.get('code')
        max_players = serializer.data.get('max_players') 
        query = Room.objects.filter(code=code) # retrieve the queryset
        if not query.exists():
            raise Http404("Room does not exist.")
         
        room = query[0] # get the first room
        user_id = self.request.session.session_key

        if room.host != user_id: # only the host can update the room
            return Response({'Message': 'You are not the room admin, can not update the room.'}, status=status.HTTP_403_FORBIDDEN)
        
        if (max_players < room.current_players) :
           return Response({'Message': 'You are trying to update the room when there is more player joined.'}, status=status.HTTP_400_BAD_REQUEST)
        
        room.max_players = max_players
        room.save(update_fields=['max_players']) 
        
        print('Room got updated. Returning response')
        return Response(RoomSerializer(room).data, status=status.HTTP_200_OK) # room updated

###################################################### TEMPLATES ############################################################

class TemplateView(generics.ListAPIView):
    queryset = Template.objects.prefetch_related('shopitem_set')
    serializer_class = TemplateSerializer


@method_decorator(csrf_protect, name='dispatch')
class CreateTemplateView(APIView):
    serializer_class = CreateTemplateSerializer
    parser_classes = [MultiPartParser]  # Add this line to use the correct parser for file uploads

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # Set CSRF token in response
        response = Response()
        response['X-CSRFToken'] = get_token(request)

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            name = serializer.data.get('name')
            bg = request.FILES.get('bg')
            bgcaption = serializer.data.get('bgcaption')
            shop_name = serializer.data.get('shop_name')
            shop_image = request.FILES.get('shop_image')
            start_balance = serializer.data.get('start_balance')

            card_type1_name = serializer.data.get('card_type1_name')
            card_type1_image = request.FILES.get('card_type1_image')
            card_type1_mvup = serializer.data.get('card_type1_mvup')

            card_type2_name = serializer.data.get('card_type2_name')
            card_type2_image = request.FILES.get('card_type2_image')
            card_type2_mvdown = serializer.data.get('card_type2_mvdown')

            card_type3_name = serializer.data.get('card_type3_name')
            card_type3_image = request.FILES.get('card_type3_image')
            card_type3_reset = serializer.data.get('card_type3_reset')

            card_type4_name = serializer.data.get('card_type4_name')
            card_type4_image = request.FILES.get('card_type4_image')
            card_type4_round_stop = serializer.data.get('card_type4_round_stop')

            queryset = Template.objects.filter(name=name)
            if queryset.exists(): # updating existing Template.
                template = queryset[0]
                template.name = name
                template.bg = bg
                template.bgcaption = bgcaption
                template.start_balance = start_balance

                template.shop_name = shop_name
                template.shop_image = shop_image

                template.card_type1_name = card_type1_name
                template.card_type1_image = card_type1_image
                template.card_type1_mvup = card_type1_mvup

                template.card_type2_name = card_type2_name
                template.card_type2_image = card_type2_image
                template.card_type2_mvdown = card_type2_mvdown

                template.card_type3_name = card_type3_name
                template.card_type3_image = card_type3_image
                template.card_type3_reset = card_type3_reset

                template.card_type4_name = card_type4_name
                template.card_type4_image = card_type4_image
                template.card_type4_round_stop = card_type4_round_stop

                template.save()

                return Response({'status': 'Template updated successfully'}) # TODO edit response

            else: # creating new Template.
                template = Template(name=name, bg=bg, bgcaption=bgcaption, start_balance=start_balance,
                                    shop_name=shop_name, shop_image=shop_image, 
                                    card_type1_name=card_type1_name, card_type1_image=card_type1_image, card_type1_mvup=card_type1_mvup,
                                    card_type2_name=card_type2_name, card_type2_image=card_type2_image, card_type2_mvdown=card_type2_mvdown,
                                    card_type3_name=card_type3_name, card_type3_image=card_type3_image, card_type3_reset=card_type3_reset,
                                    card_type4_name=card_type4_name, card_type4_image=card_type4_image, card_type4_round_stop=card_type4_round_stop
                                    )
                template.save()

                return Response({'status': 'Template created successfully'})
        # invalid
        else: 
           print(serializer.data)
           return Response({'status': 'Invalid data', 'errors': serializer.errors})



# TODO IN CASE OF LIST MODULE INSTALL: for the list;
# @method_decorator(csrf_protect, name='dispatch')
# class CreateTemplateView(APIView):
#     serializer_class = CreateTemplateSerializer
    
#     def post(self, request, format=None):
#         if not self.request.session.exists(self.request.session.session_key):
#             self.request.session.create()

#         # Set CSRF token in response
#         response = Response()
#         response['X-CSRFToken'] = get_token(request)

#         serializer = self.serializer_class(data=request.data)

#         if serializer.is_valid():
#             name = serializer.data.get('name')
#             bg = serializer.data.get('bg')
#             bgcaption = serializer.data.get('bgcaption')
#             shop_name = serializer.data.get('shop_name')
#             shop_image = serializer.data.get('shop_image')

#             card_type1_name = serializer.data.get('card_type1_name')
#             card_type1_image = serializer.data.get('card_type1_image')

#             card_type2_name = serializer.data.get('card_type2_name')
#             card_type2_image = serializer.data.get('card_type2_image')

#             card_type3_name = serializer.data.get('card_type3_name')
#             card_type3_image = serializer.data.get('card_type3_image')

#             card_type4_name = serializer.data.get('card_type4_name')
#             card_type4_image = serializer.data.get('card_type4_image')

#             queryset = Template.objects.filter(name=name)
#             if queryset.exists(): # updating existing Template.
#                 template = queryset[0]
#                 template.name = name
#                 template.bg = bg
#                 template.bgcaption = bgcaption
#                 template.shop_name = shop_name
#                 template.shop_image = shop_image

#                 template.card_type1_name = card_type1_name
#                 template.card_type1_image = card_type1_image

#                 template.card_type2_name = card_type2_name
#                 template.card_type2_image = card_type2_image

#                 template.card_type3_name = card_type3_name
#                 template.card_type3_image = card_type3_image

#                 template.card_type4_name = card_type4_name
#                 template.card_type4_image = card_type4_image

#                 template.save(update_fields=['name', 'bg', 'bgcaption', 'shop_name', 'shop_image', 
#                   'card_type1_name', 'card_type1_image',
#                   'card_type2_name', 'card_type2_image',
#                   'card_type3_name', 'card_type3_image',
#                   'card_type4_name', 'card_type4_image',
#                   'shop_items'])
#                 print('if')
#                 print(serializer.errors)
#                 return Response(TemplateSerializer(template).data, status=status.HTTP_200_OK)
#             else: # creates a new Template with set params.
#                 print('else')
#                 print(serializer.errors)
#                 template = Template(name=name, bg=bg, bgcaption=bgcaption, shop_name=shop_name, shop_image=shop_image,
#                                     card_type1_name=card_type1_name, card_type1_image=card_type1_image,
#                                     card_type2_name=card_type2_name, card_type2_image=card_type2_image,
#                                     card_type3_name=card_type3_name, card_type3_image=card_type3_image,
#                                     card_type4_name=card_type4_name, card_type4_image=card_type4_image)
#                 template.save()

#                 # Create new ShopItem instances and add them to the template
#                 for shop_item_data in shop_items_data:
#                     shop_item_name = shop_item_data.get('name')
#                     shop_item_price = shop_item_data.get('price')
#                     shop_item_template = template
#                     shop_item_image = shop_item_data.get('image')
#                     shop_item = ShopItem.objects.create(name=shop_item_name, price=shop_item_price, template=shop_item_template, image=shop_item_image)
#                     template.shop_items.add(shop_item)

#                 return Response(TemplateSerializer(template).data, status=status.HTTP_201_CREATED)

