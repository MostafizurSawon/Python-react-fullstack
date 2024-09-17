from django import forms
from .models import Cdata

class DataForm(forms.ModelForm):
    class Meta:
        model = Cdata
        fields = [
            "first_name",
            "last_name",
            "email",
            "phone",
            "address",
        ]

class DataUpdateForm(forms.ModelForm):
    class Meta:
        model = Cdata
        fields = '__all__'
        # exclude = ['name']
        

