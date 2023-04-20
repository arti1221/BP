from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse, HttpResponseNotFound
from django.shortcuts import redirect, get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import Http404
from api.models import Room, Template, ShopItem, Player, User
from api.serializers import RoomSerializer, CreateRoomSerializer, UpdateRoomSerializer, TemplateSerializer,CreateTemplateSerializer, ShopItemSerializer, PlayerSerializer, GameStartSerializer, UserSerializer, AuthorizeSerializer
from rest_framework.parsers import MultiPartParser
import base64
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile
import io
from PIL import Image
import sys
from django.contrib.auth.hashers import check_password

# TODO: if response 400 or bad, throw exception to go to catch blyat :)

class RoomView(generics.ListAPIView):
    queryset = Room.objects.prefetch_related('player_set')
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

                # Creates a new player instance for the room after room creation
                player_name = request.data.get('player_name') # Data are being retrieved through request since the serializer does not handle player Name.
                player = Player(room=room, session_id=self.request.session.session_key, player_name=player_name)
                player.save()

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
                data['session_id'] = self.request.session.session_key
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

                    # Creates a new player instance for the room after room creation
                    player_name = request.data.get('player_name') # Data are being retrieved through request since the serializer does not handle player Name.
                    player = Player(room=room, session_id=self.request.session.session_key, player_name=player_name)
                    player.save()

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
        # player_name = request.data.get("player_name")
        # player = Player.objects.get(room=room, player_name=player_name)  # retrieve player object using room and player name
        # player.delete()  # delete player object
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
      
class StartGameView(APIView):
    serializer_class = GameStartSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        print("Request data:", self.request.data)

        serializer = self.serializer_class(data=self.request.data)
        print("S VAL: ", serializer.is_valid())
        print(serializer)
        print("Errors: ", serializer.errors)
        if serializer.is_valid():
            code = serializer.data.get('code')
            game_started = serializer.data.get('game_started')

            try:
                room = Room.objects.get(code=code)
            except Room.DoesNotExist:
                raise Http404("Room does not exist.")

            room.game_started = game_started
            room.save(update_fields=['game_started'])

            return Response(GameStartSerializer(room).data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

     
###################################################### TEMPLATES ############################################################

class TemplateView(generics.ListAPIView):
    queryset = Template.objects.prefetch_related('shopitem_set')
    serializer_class = TemplateSerializer


def to_file(file_from_POST, fieldName):
    """base64 encoded file to Django InMemoryUploadedFile that can be placed into request.FILES."""
    # 'data:image/png;base64,<base64 encoded string>'
    try:
        idx = file_from_POST[:50].find(',')  # comma should be pretty early on

        if not idx or not file_from_POST.startswith('data:image/'):
            raise Exception()

        base64file = file_from_POST[idx+1:]
        attributes = file_from_POST[:idx]
        content_type = attributes[len('data:'):attributes.find(';')]

    except Exception as e:
        raise Exception("Invalid picture")
    print(content_type)
    f = io.BytesIO(base64.b64decode(base64file))
    image = InMemoryUploadedFile(f,
    field_name=fieldName,
    name=fieldName + ".png",  # use UUIDv4 or something
    content_type=content_type,
    size=sys.getsizeof(f),
    charset=None)
    return image

@method_decorator(csrf_protect, name='dispatch')
class CreateTemplateView(APIView): ## TODO CHECK SHOP ITEMS!
    serializer_class = CreateTemplateSerializer
    parser_classes = [MultiPartParser]  # Add this line to use the correct parser for file uploads
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # Set CSRF token in response
        response = Response()
        response['X-CSRFToken'] = get_token(request)

        serializer = self.serializer_class(data=request.data)
        # The copy has to be made since the request QuerySet is immutable hence it could not
        # be overriden with any image data correction from base 64 for example to png.
        # after that the original response should be used
        request_after_formatting = request.POST.copy() # copy it here
        request_after_formatting.pop('csrfmiddlewaretoken', None)  # remove csrf token if present

        # Decode base64 image data
        for fieldName in ['shop_image', 'card_type1_image', 'card_type2_image', 'card_type3_image', 'card_type4_image',
                          'card_type5_image']:
            if fieldName in request.data:
                try:
                    file_data = request.data.get(fieldName)
                    image_file = to_file(file_data, fieldName)
                    request_after_formatting[fieldName] = image_file
                    request.FILES[fieldName] = image_file
                except Exception as e:
                    pass
            else:
                request_after_formatting[fieldName] = request.data.get(fieldName)        

        if not serializer.is_valid():
            # in case the call is made through FE, the serializer contains the BASE64 Image encoded data hence the queryset has to be overriden
            serializer = self.serializer_class(data=request_after_formatting)

        if serializer.is_valid():
            name = serializer.data.get('name')
            shop_name = serializer.data.get('shop_name')
            start_balance = serializer.data.get('start_balance')
            card_type1_mvup = serializer.data.get('card_type1_mvup')
            card_type1_mvup_max = serializer.data.get('card_type1_mvup_max')

            card_type2_mvdown = serializer.data.get('card_type2_mvdown')
            card_type2_mvdown_max = serializer.data.get('card_type2_mvdown_max')

            card_type3_reset = serializer.data.get('card_type3_reset')
            card_type4_round_stop = serializer.data.get('card_type4_round_stop')
            
            card_type5_min = serializer.data.get('card_type5_min')
            card_type5_max = serializer.data.get('card_type5_max')

            reward_per_round = serializer.data.get('reward_per_round')
            number_of_rounds = serializer.data.get('number_of_rounds')
            winning_pos1 = serializer.data.get('winning_pos1')
            winning_pos2 = serializer.data.get('winning_pos2')
            winning_amt = serializer.data.get('winning_amt')

            # images
            shop_image = request.FILES.get('shop_image')
            card_type1_image = request.FILES.get('card_type1_image')
            card_type2_image = request.FILES.get('card_type2_image')
            card_type3_image = request.FILES.get('card_type3_image')
            card_type4_image = request.FILES.get('card_type4_image')
            card_type5_image = request.FILES.get('card_type5_image')

            author = serializer.data.get('author')
            queryset = Template.objects.filter(name=name)
            if queryset.exists(): # updating existing Template.
                print('exist')
                template = queryset[0]
                template.name = name
                template.start_balance = start_balance

                template.shop_name = shop_name
                template.shop_image = shop_image

                template.card_type1_image = card_type1_image
                template.card_type1_mvup = card_type1_mvup
                template.card_type1_mvup_max = card_type1_mvup_max

                template.card_type2_image = card_type2_image
                template.card_type2_mvdown = card_type2_mvdown
                template.card_type2_mvdown_max = card_type2_mvdown_max

                template.card_type3_image = card_type3_image
                template.card_type3_reset = card_type3_reset

                template.card_type4_image = card_type4_image
                template.card_type4_round_stop = card_type4_round_stop

                template.card_type5_image = card_type5_image
                template.card_type5_min = card_type5_min
                template.card_type5_max = card_type5_max

                template.reward_per_round = reward_per_round
                template.number_of_rounds = number_of_rounds
                template.winning_pos1 = winning_pos1 
                template.winning_pos2 = winning_pos2
                template.winning_amt = winning_amt
                template.author = author
                template.save(update_fields=['id', 'name', 'start_balance',
                  'card_type1_image', 'card_type1_mvup', 'card_type1_mvup_max',
                  'card_type2_image', 'card_type2_mvdown','card_type2_mvdown_max',
                  'card_type3_image', 'card_type3_reset',
                  'card_type4_image', 'card_type4_round_stop',
                  'card_type5_image', 'card_type5_min', 'card_type5_max',
                  'shop_name', 'shop_image', 'shop_items',
                  'reward_per_round', 'number_of_rounds', 
                  'winning_pos1', 'winning_pos2', 'winning_amt',
                  'author'
                  ])

                return Response(CreateTemplateSerializer(template).data, status=status.HTTP_200_OK)

            else: # creating new Template.
                template = Template(name=name, start_balance=start_balance,
                                    shop_name=shop_name, shop_image=shop_image, 
                                    card_type1_image=card_type1_image, card_type1_mvup=card_type1_mvup, card_type1_mvup_max=card_type1_mvup_max,
                                    card_type2_image=card_type2_image, card_type2_mvdown=card_type2_mvdown, card_type2_mvdown_max=card_type2_mvdown_max,
                                    card_type3_image=card_type3_image, card_type3_reset=card_type3_reset,
                                    card_type4_image=card_type4_image, card_type4_round_stop=card_type4_round_stop,
                                    card_type5_image=card_type5_image, card_type5_min=card_type5_min, card_type5_max=card_type5_max,
                                    reward_per_round=reward_per_round, number_of_rounds=number_of_rounds, 
                                    winning_pos1=winning_pos1, winning_pos2=winning_pos2, winning_amt=winning_amt,
                                    author=author
                                    )
                template.save()
                return Response(CreateTemplateSerializer(template).data, status=status.HTTP_200_OK)
                # return Response({'success': True, 'status': 'Template created successfully'}, status=status.HTTP_200_OK)
        # invalid
        else: 
        #    print(serializer.data)
           print('error')
           print(serializer.errors)
           return Response({'status': 'Invalid data', 'errors': serializer.errors})

class GetTemplateView(APIView):
    serializer_class = TemplateSerializer
    lookup_url_kwarg = 'name' # pass a param 

    def get(self, req, format=None):
        name = req.GET.get(self.lookup_url_kwarg) # get request for param code
        if (name != None):
            template = Template.objects.filter(name=name)
            if (len(template)):
                data = TemplateSerializer(template[0]).data # serializing and accessing the template, getting the first one and extracting it's data
                return Response(data, status=status.HTTP_200_OK)
            raise Http404("Template does not exist.")
        return Response({'Bad Request': 'Name param is invalid...'}, status=status.HTTP_400_BAD_REQUEST)
    
class GetAllTemplatesView(APIView):
    serializer_class = TemplateSerializer

    def get(self, req, format=None):
        templates = Template.objects.all()
        template_names = [template.name for template in templates]
        if (template_names):
            return JsonResponse({'template_names': template_names}, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'No templates found'}, status=status.HTTP_400_BAD_REQUEST)
    
class GetAuthorTemplatesView(APIView):
    serializer_class = TemplateSerializer
    lookup_url_kwarg = 'author' # pass a param 

    def get(self, req, format=None):
        author = req.query_params.get('author') # get request for param code

        if author:
            templates = Template.objects.filter(author=author)
            template_names = [template.name for template in templates]
            if template_names:
                return JsonResponse({'template_names': template_names}, status=status.HTTP_200_OK)
        return Response({'Bad Request': 'No templates found'}, status=status.HTTP_400_BAD_REQUEST)


############################################################################################################
class ShopItemsView(generics.ListAPIView):
    queryset = ShopItem.objects.all()
    serializer_class = ShopItemSerializer

@method_decorator(csrf_protect, name='dispatch')
class CreateShopItemsView(APIView):
    serializer_class = ShopItemSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        # Set CSRF token in response
        response = Response()
        response['X-CSRFToken'] = get_token(request)

        serializer = self.serializer_class(data=request.data)
        # The copy has to be made since the request QuerySet is immutable hence it could not
        # be overriden with any image data correction from base 64 for example to png.
        # after that the original response should be used
        request_after_formatting = request.POST.copy() # copy it here
        request_after_formatting.pop('csrfmiddlewaretoken', None)  # remove csrf token if present

        # in case the call is made through FE, the serializer contains the BASE64 Image encoded data hence the queryset has to be overriden
        # Decode base64 image data
        field_name = 'image'
        if 'image' in request.data:
            try:
                file_data = request.data.get(field_name)
                image_file = to_file(file_data, field_name)
                request_after_formatting[field_name] = image_file
                request.FILES[field_name] = image_file
            except Exception as e:
                pass
        else:
            request_after_formatting[field_name] = request.data.get(field_name)        

        if not serializer.is_valid():
            print("req: ", request_after_formatting)
            print("Serializer data: ", print(serializer.data))
            # in case the call is made through FE, the template is accessed and lookuped through kwarg 'name'
            try:
                template_instance = get_object_or_404(Template, id=serializer.data.get('template'))
            except Exception as e:
                print("temp name is send instead of ID")
                template = Template.objects.get(name=serializer.data.get('template'))
                template_id = template.id
                print("temp id:", template_id)
                template_instance = get_object_or_404(Template, id=template_id)

            # handle the data since they are coming in different order:
            request_after_formatting['template'] = template_instance.id
            serializer = self.serializer_class(data=request_after_formatting)


        print("som tu")
        print(serializer.is_valid())
        print(serializer.data)
        if serializer.is_valid():
            
            template = template_instance
            name = serializer.data.get('name')
            image = request.FILES.get('image')
            price = serializer.data.get('price')
            max_price = serializer.data.get('price_max')

            queryset = ShopItem.objects.filter(name=name)
            if queryset.exists(): # updating existing Template.
                shop_item = queryset[0]
                shop_item.template = template
                shop_item.name = name
                shop_item.image = image
                shop_item.price = price
                shop_item.price_max = max_price
                # update fields
                shop_item.save(update_fields=['template', 'name', 'image', 'price', 'price_max'])

                return Response({'status': 'Shop Item updated successfully'}) # Serializer should be retrieved if future usage is needed.

            else: # creating new Template.
                print("creating a new item")
                shop_item = ShopItem(template=template, 
                                     name=name,
                                     image=image,
                                     price=price,
                                     price_max=max_price
                                    )
                shop_item.save()

                return Response({'status': 'Shop item created successfully'})
        # invalid
        else: 
           print(serializer.data)
           return Response({'status': 'Invalid data', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
######################################################################################################

class PlayersView(generics.ListAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class RemovePlayerView(APIView):
    def post(self, request, format=None):
        if not request.session.exists(request.session.session_key):
            return Response({'Bad Request': 'Invalid session...'}, status=status.HTTP_400_BAD_REQUEST)

        session_id = request.session.session_key
        room_code = request.data.get('code')
        print("Session id: ", session_id)
        try:
            room = Room.objects.get(code=room_code)
            # remove the player based on the room code and session Id. (Double check required)
            player = Player.objects.get(session_id=session_id, room=room.id)
            player.delete()
            return Response({'success': 'Player removed successfully'}, status=status.HTTP_200_OK)
        except Player.DoesNotExist:
            raise Http404('Player does not exist.')
        
#######################################################################################################
class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@method_decorator(csrf_protect, name='dispatch')
class RegisterUserView(APIView):
    serializer_class = UserSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        # Set CSRF token in response
        response = Response()
        response['X-CSRFToken'] = get_token(request)

        serializer = self.serializer_class(data=request.data)
        print("is valid: ", serializer.is_valid())
        print("serializer data: ", serializer.data)
        if serializer.is_valid():
            
            name = serializer.data.get('name')
            password = serializer.data.get('password')

            queryset = User.objects.filter(name=name)
            
            print("e", queryset.exists())
            if not queryset.exists(): # updating existing Template.
                user = User(name=name,
                            password=password,
                            )
                user.save()
                return Response({'status': 'User Registered successfully'})
        else: 
           print("ss", serializer.data)
           return Response({'status': 'Invalid data', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        

@method_decorator(csrf_protect, name='dispatch')
class AuthorizeUser(APIView):
    serializer_class = AuthorizeSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        # Set CSRF token in response
        response = Response()
        response['X-CSRFToken'] = get_token(request)

        serializer = self.serializer_class(data=request.data)

        print("is valid: ", serializer.is_valid())
        print("serializer data: ", serializer.data)
        if serializer.is_valid():
            name = serializer.data.get('name')
            password = serializer.data.get('password')
            queryset = User.objects.filter(name=name)

            if queryset.exists(): # updating existing Template.
                user = queryset[0]
                pwd_ok = check_password(password, user.password)
                if (pwd_ok):
                    return Response({'status': 'User logged in successfully.'}, status=status.HTTP_200_OK)
                return Response({'status': 'Invalid password', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)  
            return Response({'status': 'Invalid username', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)               
        print("error: ", serializer.data)
        return Response({'status': 'Invalid data', 'errors': serializer.errors})