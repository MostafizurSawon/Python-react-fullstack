from django.db import models

# Create your models here.
class Cdata(models.Model):
  first_name = models.CharField(max_length=20)
  last_name = models.CharField(max_length=20)
  email=models.EmailField(max_length=30)
  phone=models.CharField(max_length=14)
  address=models.TextField()
  
  def __str__(self):
    return self.first_name