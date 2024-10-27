from django.http import HttpResponse
from django.shortcuts import render
from Events.models import Events


def home(request):
  ev = Events.objects.all()
  return render(request, 'base.html', {'ev': ev})