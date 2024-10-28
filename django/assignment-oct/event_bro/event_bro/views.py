from django.http import HttpResponse
from django.shortcuts import render
from Events.models import Events
from UserProfiles.models import UserBooked


def home(request):
  ev = Events.objects.all()
  booked_events = UserBooked.objects.filter(user=request.user).values_list('ev_id', flat=True)
  return render(request, 'base.html', {'ev': ev, 'booked_events': booked_events})