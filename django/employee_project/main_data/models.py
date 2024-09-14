from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class E_data(models.Model):
  DESIGNATION_CHOICES = [
      ('Manager', 'Manager'),
      ('Accountant', 'Accountant'),
      ('HR', 'HR'),
      ('Software Developer', 'Software Developer'),
      ('Intern', 'Intern'),
  ]
  
  GENDER_CHOICES = [
      ('Male', 'Male'),
      ('Female', 'Female'),
  ]
  # name = models.CharField(max_length=40)
  name = models.OneToOneField(User, on_delete=models.CASCADE)
  address = models.TextField()
  phone = models.CharField(max_length=14)
  salary = models.DecimalField(max_digits=10, decimal_places=2)
  designation = models.CharField(max_length=20, choices=DESIGNATION_CHOICES)
  gender = models.CharField(max_length=20, blank=True, choices=GENDER_CHOICES)
  created_on = models.DateTimeField(blank=True, null=True, auto_now_add=True)
  description = models.TextField(blank=True, null=True)
  
  def __str__(self):
    return self.name.username