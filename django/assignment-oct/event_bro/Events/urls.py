from django.urls import path
from .views import addLocationForm, addEventForm, addCategoryForm

urlpatterns = [
    path('add-event/', addEventForm, name='add-event'),
    path('add-location/', addLocationForm, name='add-location'),
    path('add-category/', addCategoryForm, name='add-category'),
]