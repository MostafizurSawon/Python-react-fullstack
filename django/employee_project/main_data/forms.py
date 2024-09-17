from django import forms
from .models import E_data
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator

class DataForm(forms.ModelForm):
    phone = forms.CharField(
        max_length=14,
        validators=[RegexValidator(r'^\d+$', message="Phone number must contain only digits.")],
        widget=forms.TextInput(attrs={'placeholder': 'Phone Number'})
    )
    class Meta:
        model = E_data
        fields = [
            "employee",
            "address",
            "phone",
            "salary",
            "designation",
            "gender",
            "description"
        ]

class DataUpdateForm(forms.ModelForm):
    phone = forms.CharField(
        max_length=14,
        validators=[RegexValidator(r'^\d+$', message="Phone number must contain only digits.")],
        widget=forms.TextInput(attrs={'placeholder': 'Phone Number'})
    )
    class Meta:
        model = E_data
        fields = '__all__'
        exclude = ['name']
        widgets = {
            'designation': forms.TextInput(attrs={'readonly': 'true'}),
            'salary': forms.TextInput(attrs={'readonly': 'true'}),
        }
