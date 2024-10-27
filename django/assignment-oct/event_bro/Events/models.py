from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Location(models.Model):
  name = models.CharField(max_length=30, null=True, blank=True, default="")
  
  def __str__(self):
    return self.name
  
class Category(models.Model):
  name = models.CharField(max_length=30, null=True, blank=True, default="")
  
  def __str__(self):
    return self.name

class Events(models.Model):
  name = models.CharField(max_length=50, blank=True, null=True)
  date = models.DateField(blank=True, null=True)
  owner = models.ForeignKey(User, related_name='events', on_delete=models.CASCADE)
  location = models.ForeignKey(Location, related_name='event_location', on_delete=models.CASCADE, null=True, blank=True)
  cat = models.ForeignKey(Category, related_name='event_category', on_delete=models.CASCADE, null=True, blank=True)
  description = models.TextField()
  limit = models.IntegerField(null=True, blank=True, default=3)
  created_date = models.DateField(auto_now_add=True, null=True, blank=True)
  
  def __str__(self):
    return f"{self.owner.username}'s {self.name}"