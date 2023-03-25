from django.db import models
import string, random

def generate_random_code():
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    while (Room.objects.filter(code=code).count() != 0):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return code

# Create your models here.
# interpretes database operations
# model -> serializer -> view -> URL for the backend.

class Room(models.Model):
    code = models.CharField(max_length=8, default=generate_random_code, unique=True) # Room Code to join to
    host = models.CharField(max_length=30, unique=True) # the admin of the room
    created_at = models.DateField(auto_now_add=True) # auto timestamp of the creation
    max_players = models.IntegerField(null=False, default=4) # max players in the room
    current_players = models.IntegerField(null=False, default=1) # be default, the host is in the room after creation
    # templateid = models.IntegerField(null=False, default=1)

class Template(models.Model): # ID of the Template will be automatically added. Matching the template to the room settings will be processed through the ID/Code
    name = models.CharField(max_length=20, unique=True) # Template name
    bg = models.ImageField(upload_to='images/')
    bgcaption = models.CharField(max_length=20, unique=True) # bg image name(caption)
    card_type1_name = models.CharField(max_length=20, default='Card Type 1')
    card_type1_image = models.ImageField(upload_to='images/', blank=True, null=True)
    card_type2_name = models.CharField(max_length=20, default='Card Type 2')
    card_type2_image = models.ImageField(upload_to='images/', blank=True, null=True)
    card_type3_name = models.CharField(max_length=20, default='Card Type 3')
    card_type3_image = models.ImageField(upload_to='images/', blank=True, null=True)
    card_type4_name = models.CharField(max_length=20, default='Card Type 4')
    card_type4_image = models.ImageField(upload_to='images/', blank=True, null=True)
    shop_name = models.CharField(max_length=20, default='Card Type 4')
    shop_image = models.ImageField(upload_to='images/', blank=True, null=True)
    created_at = models.DateField(auto_now_add=True) # auto timestamp of the creation