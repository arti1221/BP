from rest_framework import serializers
from api.models import Room, ShopItem, Template

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'created_at', 'max_players', 'current_players')

class CreateRoomSerializer(serializers.ModelSerializer): # serializes post request
    class Meta:
        model = Room
        fields = ('max_players',) # fields that are used in the post request and validates

class UpdateRoomSerializer(serializers.ModelSerializer): # serializes the update request and sends the data that are to be updated
    code = serializers.CharField(validators=[]) # does not validate, we want to use a code that already exists since it is unique true
    
    class Meta:
        model = Room
        fields = ('max_players', 'code') # ID of the template should be added here.

class ShopItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopItem
        fields = ['id', 'name', 'image', 'price']

class TemplateSerializer(serializers.ModelSerializer):
    shop_items = ShopItemSerializer(many=True, read_only=True, source='shopitem_set')
    class Meta:
        model = Template
        fields = ['id', 'name', 'bg', 'bgcaption', 'shop_name', 'shop_image', 'start_balance',
                  'card_type1_name', 'card_type1_image', 'card_type1_mvup',
                  'card_type2_name', 'card_type2_image', 'card_type2_mvdown',
                  'card_type3_name', 'card_type3_image', 'card_type3_reset',
                  'card_type4_name', 'card_type4_image', 'card_type4_round_stop',
                  'shop_items']
        
# WORKS WITHOUT SHOP ITEMS ON CEATION. Shop items are gonna be handled separately.
class CreateTemplateSerializer(serializers.ModelSerializer):
    shop_items = serializers.PrimaryKeyRelatedField(many=True, queryset=ShopItem.objects.all())

    class Meta:
        model = Template
        fields = ('id', 'name', 'bg', 'bgcaption', 'start_balance',
                  'card_type1_name', 'card_type1_image', 'card_type1_mvup',
                  'card_type2_name', 'card_type2_image', 'card_type2_mvdown',
                  'card_type3_name', 'card_type3_image', 'card_type3_reset',
                  'card_type4_name', 'card_type4_image', 'card_type4_round_stop',
                  'shop_name', 'shop_image', 'shop_items')

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
        instance.bg = validated_data.get('bg', instance.bg)
        instance.bgcaption = validated_data.get('bgcaption', instance.bgcaption)
        instance.start_balance = validated_data.get('start_balance', instance.start_balance)

        instance.card_type1_name = validated_data.get('card_type1_name', instance.card_type1_name)
        instance.card_type1_image = validated_data.get('card_type1_image', instance.card_type1_image)
        instance.card_type1_mvup = validated_data.get('card_type1_mvup', instance.card_type1_mvup)

        instance.card_type2_name = validated_data.get('card_type2_name', instance.card_type2_name)
        instance.card_type2_image = validated_data.get('card_type2_image', instance.card_type2_image)
        instance.card_type2_mvdown = validated_data.get('card_type2_mvdown', instance.card_type2_mvdown)

        instance.card_type3_name = validated_data.get('card_type3_name', instance.card_type3_name)
        instance.card_type3_image = validated_data.get('card_type3_image', instance.card_type3_image)
        instance.card_type3_reset = validated_data.get('card_type3_reset', instance.card_type3_reset)

        instance.card_type4_name = validated_data.get('card_type4_name', instance.card_type4_name)
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

###########################################################################################


# TODO IN CASE OF LIST MODULE INSTALL: for the list;
# class CreateShopItemSerializer(serializers.ModelSerializer):
#     template = serializers.PrimaryKeyRelatedField(queryset=Template.objects.all())
#     name = serializers.CharField(max_length=255)
#     price = serializers.DecimalField(max_digits=6, decimal_places=2)
#     image = serializers.ImageField()

#     class Meta:
#         model = ShopItem
#         fields = ('id', 'template', 'name', 'price', 'image')

#     def create(self, validated_data):
#         return ShopItem.objects.create(**validated_data)

# class CreateTemplateSerializer(serializers.ModelSerializer):
#     shop_items = serializers.ListField(child=serializers.DictField())

#     class Meta:
#         model = Template
#         fields = ('id', 'name', 'bg', 'bgcaption',
#                    'card_type1_name', 'card_type1_image', 
#                    'card_type2_name', 'card_type2_image', 
#                    'card_type3_name', 'card_type3_image', 
#                    'card_type4_name', 'card_type4_image', 'shop_name', 'shop_image', 'shop_items')

#     def create(self, validated_data):
#         shop_items_data = validated_data.pop('shop_items')
#         template = Template.objects.create(**validated_data)
#         for shop_item_data in shop_items_data:
#             ShopItem.objects.create(template=template, **shop_item_data)
#         return template

#     def update(self, instance, validated_data):
#         shop_items_data = validated_data.pop('shop_items')
#         shop_items = (instance.shop_items).all()
#         shop_items = list(shop_items)
#         instance.name = validated_data.get('name', instance.name)
#         instance.bg = validated_data.get('bg', instance.bg)
#         instance.bgcaption = validated_data.get('bgcaption', instance.bgcaption)
#         instance.card_type1_name = validated_data.get('card_type1_name', instance.card_type1_name)
#         instance.card_type1_image = validated_data.get('card_type1_image', instance.card_type1_image)
#         instance.card_type2_name = validated_data.get('card_type2_name', instance.card_type2_name)
#         instance.card_type2_image = validated_data.get('card_type2_image', instance.card_type2_image)
#         instance.card_type3_name = validated_data.get('card_type3_name', instance.card_type3_name)
#         instance.card_type3_image = validated_data.get('card_type3_image', instance.card_type3_image)
#         instance.card_type4_name = validated_data.get('card_type4_name', instance.card_type4_name)
#         instance.card_type4_image = validated_data.get('card_type4_image', instance.card_type4_image)
#         instance.shop_name = validated_data.get('shop_name', instance.shop_name)
#         instance.shop_image = validated_data.get('shop_image', instance.shop_image)
#         instance.save()

#         for shop_item_data in shop_items_data:
#             shop_item = shop_items.pop(0)
#             shop_item.name = shop_item_data.get('name', shop_item.name)
#             shop_item.image = shop_item_data.get('image', shop_item.image)
#             shop_item.price = shop_item_data.get('price', shop_item.price)
#             shop_item.save()

#         for shop_item in shop_items:
#             shop_item.delete()

#         return instance


# class CreateTemplateSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Template
#         fields = ['name', 'bg', 'bgcaption', 'shop_name', 'shop_image', 
#                   'card_type1_name', 'card_type1_image',
#                   'card_type2_name', 'card_type2_image',
#                   'card_type3_name', 'card_type3_image',
#                   'card_type4_name', 'card_type4_image',
#                   'shop_items']