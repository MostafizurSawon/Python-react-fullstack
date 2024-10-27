from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from .forms import LocationForm, EventForm, CatForm

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

from django.contrib import messages
from django.shortcuts import redirect

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

@login_required 
def addEventForm(request):
    if request.method == 'POST':
        form = EventForm(request.POST)
        if form.is_valid():
            event = form.save(commit=False)  # Create the form instance but don't save to DB yet
            event.owner = request.user       # Assign the logged-in user as the owner
            event.save()                     # Save to the database
            messages.success(request, f"{event.name} event added successfully")
            return redirect('add-event')          # Redirect to a success page
    else:
        form = EventForm()

    return render(request, 'forms/add-position.html', {'form': form, 'type': 'Add Event'})