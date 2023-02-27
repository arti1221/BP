from django.db import models
import string, random

def generate_random_code():
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    while (Room.objects.filter(code=code).count() != 0):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return code

# Create your models here.
# interpretes database operations
# model -> serializer -> view -> URL

class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_random_code, unique=True) # Room Code to join to
    host = models.CharField(max_length=30, unique=True) # the admin of the room
    created_at = models.DateField(auto_now_add=True) # auto timestamp of the creation
    max_players = models.IntegerField(null=False, default=4) # max players in the room
    current_players = models.IntegerField(null=False, default=1) # be default, the host is in the room after creation