from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import Location, Events, Category
from django import forms
from django.utils import timezone

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
            'name': forms.TextInput(attrs={'class': 'form-control', 'required': 'required'}),
            'date': forms.DateInput(attrs={'type': 'date', 'class': 'form-control', 'required': 'required'}),
            'location': forms.Select(attrs={'class': 'form-control', 'required': 'required'}),
            'limit': forms.NumberInput(attrs={'class': 'form-control', 'required': 'required'}),
            'cat': forms.Select(attrs={'class': 'form-control', 'required': 'required'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'required': 'required'}),
        }
        
    def clean_limit(self):
        limit = self.cleaned_data.get('limit')
        if limit is not None and (limit < 2):
            raise forms.ValidationError("Seat limit must be at least 2.")
        return limit
    
    def clean_date(self):
        date = self.cleaned_data.get('date')
        today = timezone.now().date()  # Get today's date
        minimum_date = today + timezone.timedelta(days=7)  # Date must be at least 7 days from today
        
        if date is not None:
            if date < today:
                raise forms.ValidationError("Event date cannot be in the past.")
            if date < minimum_date:
                raise forms.ValidationError("Event date must be at least 7 days from today.")
        
        return date
