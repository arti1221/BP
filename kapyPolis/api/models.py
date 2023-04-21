from django.db import models
import string, random
import os 
import uuid
from django.conf import settings
from django.contrib.auth.hashers import make_password

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
    game_started = models.BooleanField(null=False, default=False)
    template_name = models.CharField(max_length=20, default="")

class Player(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=50)
    player_name = models.CharField(max_length=20)

class Template(models.Model): # ID of the Template will be automatically added. Matching the template to the room settings will be processed through the ID/Code
    name = models.CharField(max_length=20, unique=True) # Template name
    start_balance = models.IntegerField(null=False, default=1000) # default starting balance before the game starts.
    
    card_type1_image = models.ImageField(upload_to=upload_path, blank=True, null=True)
    card_type1_mvup = models.IntegerField(null=False, default=3) # moves the player that took this card forwards
    card_type1_mvup_max = models.IntegerField(null=False, default=4)

    card_type2_image = models.ImageField(upload_to=upload_path, blank=True, null=True)
    card_type2_mvdown = models.IntegerField(null=False, default=3) # moves the player that took this card backwards
    card_type2_mvdown_max = models.IntegerField(null=False, default=4)

    card_type3_image = models.ImageField(upload_to=upload_path, blank=True, null=True)
    card_type3_reset = models.BooleanField(default=False) # tells whether to reset the player on the start or he's lucky and got empty card
    
    card_type4_image = models.ImageField(upload_to=upload_path, blank=True, null=True)
    card_type4_round_stop = models.IntegerField(null=False, default=1) # how many rounds the player could not move.
    
    card_type5_image = models.ImageField(upload_to=upload_path, blank=True, null=True)
    card_type5_min = models.IntegerField(null=False, default=100) # the reward or cost range card type
    card_type5_max = models.IntegerField(null=False, default=1000)

    reward_per_round = models.IntegerField(null=False, default=500) # how many rounds the player could not move.
    
    number_of_rounds = models.IntegerField(null=False, default=24) # how many rounds the player could not move.

    winning_pos1 = models.BooleanField(default=False)
    winning_pos2 = models.BooleanField(default=False)

    winning_amt = models.IntegerField(null=False, default=1) # in case of winning, this column defines the amount for the rule. Either pos1 or pos2

    shop_name = models.CharField(max_length=20, default='Card Type 4')
    shop_image = models.ImageField(upload_to=upload_path, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True) # auto timestamp of the creation
    author = models.CharField(max_length=20, default='admin')

class ShopItem(models.Model):
    template = models.ForeignKey(Template, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    image = models.ImageField(upload_to=upload_path) # todo template instead of name!
    price = models.IntegerField(null=False, default=1)
    price_max = models.IntegerField(null=False, default=100)
    
    def __str__(self) -> str:
        return self.name

class User(models.Model):
    name = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    
    def save(self, *args, **kwargs):
        # Encode password before saving
        self.password = make_password(self.password)
        super().save(*args, **kwargs)