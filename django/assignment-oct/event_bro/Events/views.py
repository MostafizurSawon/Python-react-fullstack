from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from .forms import LocationForm, EventForm, CatForm
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from .models import Events
from UserProfiles.models import UserBooked

# Create your views here.

def addEvents(request):
  return HttpResponse("Yes")


@login_required 
def addLocationForm(request):
    if request.method == 'POST':
        form = LocationForm(request.POST)
        if form.is_valid():
            form.save()
            # Redirect back to the original form or a success page
            return redirect('add-location')  # Redirect back to the profile
    else:
        form = LocationForm()

    return render(request, 'forms/add-position.html', {'form': form, 'type': 'Add Location'})
    # return render(request, 'navbar.html', {'form_l': form})


@login_required 
def addCategoryForm(request):
    if request.method == 'POST':
        form = CatForm(request.POST)
        if form.is_valid():
            category = form.save()  # Save and retrieve the saved category instance
            # Add a success message with the category name
            messages.success(request, f"{category.name} category added successfully")
            # Redirect back to the add-category page or wherever appropriate
            return redirect('add-category')
    else:
        form = CatForm()

    return render(request, 'forms/add-position.html', {'form': form, 'type': 'Add Category'})

from django.contrib import messages

@login_required 
def addEventForm(request):
    if request.method == 'POST':
        form = EventForm(request.POST)
        
        if form.is_valid():
            print(form.cleaned_data)  # Print the cleaned data for debugging
            event = form.save(commit=False)  # Create the form instance but don't save to DB yet
            event.owner = request.user       # Assign the logged-in user as the owner
            event.save()                     # Save to the database
            messages.success(request, f"{event.name} event added successfully")
            return redirect('add-event')          # Redirect to a success page
        else:
            # If the form is not valid, print the errors for debugging
            print("Form errors:", form.errors)
            # Optionally, you can add a message for the user about the error
            messages.error(request, "There was an error with your submission. Please correct the errors below.")
    else:
        form = EventForm()

    # Render the form with any validation errors included
    return render(request, 'forms/add-position.html', {'form': form, 'type': 'Add Event'})

@login_required
def bookEvent(request, event_id):
    event = get_object_or_404(Events, id=event_id)
    if event.owner == request.user:
        messages.warning(request, "You cannot book your own event!")
        return redirect('home')
    # Check if the user has already booked this event or not
    already_booked = UserBooked.objects.filter(user=request.user, ev=event).exists()
    if already_booked:
        messages.info(request, "You have already booked this event.")
    elif event.limit > 0:
        UserBooked.objects.create(user=request.user, ev=event)
        messages.success(request, f"You have successfully booked {event.name}.")
        event.limit -= 1
        event.save()
    else:
        messages.error(request, "Sorry, this event is fully booked.")

    return redirect('home')

@login_required
def updateEvent(request, event_id):
    event = get_object_or_404(Events, id=event_id)

    # Allow only the owner to update the event
    if event.owner != request.user and not request.user.is_superuser:
        messages.error(request, "You do not have permission to edit this event.")
        return redirect('home')

    if request.method == 'POST':
        form = EventForm(request.POST, instance=event)
        if form.is_valid():
            form.save()
            messages.success(request, f"The event '{event.name}' has been updated.")
            return redirect('home')
    else:
        form = EventForm(instance=event)

    return render(request, 'forms/update.html', {'form': form, 'event': event,'type': 'Update Event'}) 

@login_required
def deleteEvent(request, event_id):
    event = get_object_or_404(Events, id=event_id)

    if event.owner != request.user and not request.user.is_superuser:
        messages.error(request, "You do not have permission to delete this event.")
        return redirect('home')

    event.delete()
    messages.success(request, f"The event '{event.name}' has been deleted successfully.")
    return redirect('home')

@login_required
def bookedEvent(request):
    booked = UserBooked.objects.filter(user=request.user)
    return render(request, 'booked.html', {'booked':booked})