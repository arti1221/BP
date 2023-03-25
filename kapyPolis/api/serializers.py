from rest_framework import serializers
from api.models import Room, Template

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

class TemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Template
        fields = ['id', 'name', 'bg', 'bgcaption', 'shop_name', 'shop_image', 
                  'card_type1_name', 'card_type1_image',
                  'card_type2_name', 'card_type2_image',
                  'card_type3_name', 'card_type3_image',
                  'card_type4_name', 'card_type4_image',
                  ]
