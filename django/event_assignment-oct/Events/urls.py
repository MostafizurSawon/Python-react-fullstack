from django.urls import path
from .views import addLocationForm, addEventForm, addCategoryForm, bookEvent, updateEvent, deleteEvent, bookedEvent

urlpatterns = [
    path('add-event/', addEventForm, name='add-event'),
    path('add-location/', addLocationForm, name='add-location'),
    path('add-category/', addCategoryForm, name='add-category'),
    path('booked/', bookedEvent, name='booked-event'),
    path('book-event/<int:event_id>/', bookEvent, name='book_event'),
    path('update-event/<int:event_id>/', updateEvent, name='update_event'),
    path('delete-event/<int:event_id>/', deleteEvent, name='delete_event'),
]