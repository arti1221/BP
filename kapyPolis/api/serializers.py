from rest_framework import serializers
from api.models import Room

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'created_at', 'max_players', 'current_players')