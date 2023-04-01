from django.db import models
import string, random
import os 
import uuid
from django.conf import settings

def generate_random_code():
    code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    while (Room.objects.filter(code=code).count() != 0):
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return code

# def upload_path(instance, file_name):
#     return '/'.join(['images', str(instance.name), file_name]) # path will be MEDIA_DIR/arg1/template.name/fileName

def upload_path(instance, filename):
    # Get the class name of the instance
    cls_name = instance.__class__.__name__.lower()
    
    # Create the media directory if it doesn't exist in form MEDIA_ROOT/Class/names
    media_dir = os.path.join(settings.MEDIA_ROOT, cls_name)
    if not os.path.exists(media_dir):
        os.makedirs(media_dir)

    # Build the full path to the file
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    return os.path.join(cls_name, filename)

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
    bg = models.ImageField(upload_to=upload_path)
    bgcaption = models.CharField(max_length=20, unique=True) # bg image name(caption)
    start_balance = models.IntegerField(null=False, default=1000) # default starting balance before the game starts.
    
    card_type1_name = models.CharField(max_length=20, default='Card Type 1')
    card_type1_image = models.ImageField(upload_to=upload_path, blank=True, null=True)
    card_type1_mvup = models.IntegerField(null=False, default=3) # moves the player that took this card forwards

    card_type2_name = models.CharField(max_length=20, default='Card Type 2')
    card_type2_image = models.ImageField(upload_to=upload_path, blank=True, null=True)
    card_type2_mvdown = models.IntegerField(null=False, default=3) # moves the player that took this card backwards

    card_type3_name = models.CharField(max_length=20, default='Card Type 3')
    card_type3_image = models.ImageField(upload_to=upload_path, blank=True, null=True)
    card_type3_reset = models.BooleanField(default=False) # tells whether to reset the player on the start or he's lucky and got empty card
    
    card_type4_name = models.CharField(max_length=20, default='Card Type 4')
    card_type4_image = models.ImageField(upload_to=upload_path, blank=True, null=True)
    card_type4_round_stop = models.IntegerField(null=False, default=1) # how many rounds the player could not move.
    
    shop_name = models.CharField(max_length=20, default='Card Type 4')
    shop_image = models.ImageField(upload_to=upload_path, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True) # auto timestamp of the creation

class ShopItem(models.Model):
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to=upload_path) # todo template instead of name!
    price = models.DecimalField(max_digits=6, decimal_places=2)