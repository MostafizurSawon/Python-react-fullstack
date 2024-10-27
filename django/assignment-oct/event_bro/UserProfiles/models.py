from django.db import models
from django.contrib.auth.models import User
import random

class UserAccount(models.Model):
    GENDER_CHOICES = [
      ('Male', 'Male'),
      ('Female', 'Female'),
    ]
    
    images = [
      'https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100207.jpg',
      'https://img.freepik.com/free-photo/cartoon-character-with-handbag-sunglasses_71767-99.jpg',
      'https://img.freepik.com/free-photo/anime-style-character-space_23-2151134190.jpg', 
      'https://img.freepik.com/premium-photo/poster-anime-character-with-fiery-background_943629-32000.jpg',
      'https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100183.jpg'
      ]
    
    # print(random.choice(images))
  
    user = models.OneToOneField(User, related_name='account', on_delete=models.CASCADE)
    created_on = models.DateField(auto_now_add=True, null=True, blank=True)
    image = models.URLField(blank=True, null=True, default=random.choice(images))
    gender = models.CharField(max_length=20, blank=True, choices=GENDER_CHOICES)
    mobile = models.CharField(max_length=14, blank=True)
    points = models.IntegerField(null=True, blank=True, default=0)
    age = models.IntegerField(null=True, blank=True)
    hometown = models.CharField(max_length=20)
    address = models.TextField(blank=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.user.first_name
    