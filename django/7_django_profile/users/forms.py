# users/forms.py
from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User
from .models import Profile

class LoginForm(AuthenticationForm):
    username = forms.CharField(max_length=254, widget=forms.TextInput(attrs={
        'placeholder': 'Username'
    }))
    password = forms.CharField(label="Password", widget=forms.PasswordInput(attrs={
        'placeholder': 'Password'
    }))

class OTPForm(forms.Form):
    otp = forms.CharField(max_length=6, widget=forms.TextInput(attrs={
        'placeholder': 'Enter OTP'
    }))

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['mobile_number', 'address']
        widgets = {
            'mobile_number': forms.TextInput(attrs={'placeholder': 'Mobile Number'}),
            'address': forms.Textarea(attrs={'placeholder': 'Address', 'rows': 3}),
        }


class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True, help_text='Required. Enter a valid email address.')

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')