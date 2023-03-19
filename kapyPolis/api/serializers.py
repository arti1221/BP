from rest_framework import serializers
from api.models import Room

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