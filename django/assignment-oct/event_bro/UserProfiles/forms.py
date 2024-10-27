from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import UserAccount
from django import forms

class UserRegistrationForm(UserCreationForm):
    usable_password = None  
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']
        

class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserAccount
        # fields = '__all__'
        fields = ['image','gender','hometown','mobile', 'age', 'address', 'description'] 
        
        labels = {
            'gender': 'Gender',
            'hometown': 'Hometown',
            'address': 'Address',
            'mobile': 'Mobile Number',
            'age': 'Age',
            'description': 'Short Description',
        }
 