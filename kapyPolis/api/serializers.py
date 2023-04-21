from rest_framework import serializers
from api.models import Room, ShopItem, Template, Player, User

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'room', 'session_id', 'player_name']

class RoomSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True, read_only=True, source='player_set')
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'created_at', 'max_players', 'current_players', 'game_started','players',
                   'template_name')

class CreateRoomSerializer(serializers.ModelSerializer): # serializes post request
    players = PlayerSerializer(many=True, read_only=True, source='player_set')
    class Meta:
        model = Room
        fields = ('max_players', 'players', 'template_name') # fields that are used in the post request and validates

class UpdateRoomSerializer(serializers.ModelSerializer): # serializes the update request and sends the data that are to be updated
    code = serializers.CharField(validators=[]) # does not validate, we want to use a code that already exists since it is unique true
    
    class Meta:
        model = Room
        fields = ('max_players', 'code', 'template_name') # ID of the template should be added here.

class GameStartSerializer(serializers.ModelSerializer):
    code = serializers.CharField(validators=[])
    class Meta:
        model = Room
        fields = ('code', 'game_started', 'template_name')

# TODO add startGame Serializer

class ShopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopItem
        fields = ['id', 'template', 'name', 'image', 'price', 'price_max']

class TemplateSerializer(serializers.ModelSerializer):
    shop_items = ShopItemSerializer(many=True, read_only=True, source='shopitem_set')
    class Meta:
        model = Template
        fields = ['id', 'name', 'shop_name', 'shop_image', 'start_balance',
                  'card_type1_image', 'card_type1_mvup',
                  'card_type2_image', 'card_type2_mvdown',
                  'card_type3_image', 'card_type3_reset',
                  'card_type4_image', 'card_type4_round_stop',
                  'shop_items',
                  'card_type1_mvup_max', 'card_type2_mvdown_max', 
                  'card_type5_image', 'card_type5_min', 'card_type5_max',
                  'reward_per_round', 'number_of_rounds', 
                  'winning_pos1', 'winning_pos2', 'winning_amt',
                  'author'
                  ]
        
# WORKS WITHOUT SHOP ITEMS ON CEATION. Shop items are gonna be handled separately.
class CreateTemplateSerializer(serializers.ModelSerializer):
    shop_items = ShopItemSerializer(many=True, read_only=True, source='shopitem_set')
    class Meta:
        model = Template
        fields = ('id', 'name', 'start_balance',
                  'card_type1_image', 'card_type1_mvup',
                  'card_type2_image', 'card_type2_mvdown',
                  'card_type3_image', 'card_type3_reset',
                  'card_type4_image', 'card_type4_round_stop',
                  'shop_name', 'shop_image', 'shop_items',
                  'card_type1_mvup_max', 'card_type2_mvdown_max', 
                  'card_type5_image', 'card_type5_min', 'card_type5_max',
                  'reward_per_round', 'number_of_rounds', 
                  'winning_pos1', 'winning_pos2', 'winning_amt',
                  'author'
                  )

    def create(self, validated_data):
        shop_items_data = validated_data.pop('shop_items')
        template = Template.objects.create(**validated_data)
        for shop_item_data in shop_items_data:
            shop_item = ShopItem.objects.create(template=template, **shop_item_data)
            template.shop_items.add(shop_item)
        return template

    def update(self, instance, validated_data):
        shop_items_data = validated_data.pop('shop_items')
        shop_items = instance.shop_items.all()

        instance.name = validated_data.get('name', instance.name)
        instance.start_balance = validated_data.get('start_balance', instance.start_balance)

        instance.card_type1_image = validated_data.get('card_type1_image', instance.card_type1_image)
        instance.card_type1_mvup = validated_data.get('card_type1_mvup', instance.card_type1_mvup)

        instance.card_type2_image = validated_data.get('card_type2_image', instance.card_type2_image)
        instance.card_type2_mvdown = validated_data.get('card_type2_mvdown', instance.card_type2_mvdown)

        instance.card_type3_image = validated_data.get('card_type3_image', instance.card_type3_image)
        instance.card_type3_reset = validated_data.get('card_type3_reset', instance.card_type3_reset)

        instance.card_type4_image = validated_data.get('card_type4_image', instance.card_type4_image)
        instance.card_type4_round_stop = validated_data.get('card_type4_round_stop', instance.card_type4_round_stop)

        instance.shop_name = validated_data.get('shop_name', instance.shop_name)
        instance.shop_image = validated_data.get('shop_image', instance.shop_image)
        instance.save()

        for shop_item_data in shop_items_data:
            if 'id' in shop_item_data:
                shop_item = shop_items.get(id=shop_item_data['id'])
                shop_item.name = shop_item_data.get('name', shop_item.name)
                shop_item.image = shop_item_data.get('image', shop_item.image)
                shop_item.price = shop_item_data.get('price', shop_item.price)
                shop_item.save()
            else:
                shop_item = ShopItem.objects.create(template=instance, **shop_item_data)
                instance.shop_items.add(shop_item)

        for shop_item in shop_items:
            if shop_item not in [shop_item_data.id for shop_item_data in shop_items_data]:
                shop_item.delete()

        return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'password']

class AuthorizeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(validators=[]) # does not validate, we want to use a code that already exists since it is unique true
    class Meta:
        model = User
        fields = ['id', 'name', 'password']