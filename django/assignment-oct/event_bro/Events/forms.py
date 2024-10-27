from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Location, Events, Category
from django import forms
        

class LocationForm(forms.ModelForm):
    class Meta:
        model = Location
        fields = '__all__'
        
        labels = {
            'name': 'Location',
        }
        
class CatForm(forms.ModelForm):
    name = forms.CharField(label='Category Name', required=True)  # Set 'name' field as required

    class Meta:
        model = Category
        fields = '__all__'
        
class EventForm(forms.ModelForm):
    class Meta:
        model = Events
        fields = ['name', 'date', 'location', 'limit', 'cat', 'description']
        
        labels = {
            'name': 'Event name',
            'date': 'Event date',
            'location': 'Event location',
            'limit': 'Seat Limit',
            'cat': 'Event Category',
            'description': 'Event description'
        }
 
        widgets = {
            'date': forms.DateInput(attrs={
                'type': 'date',  # HTML5 date input
                'class': 'form-control',  # Add Bootstrap or custom class for styling
            }),
        }