from django.shortcuts import render
from django.db.models import Q
from Events.models import Events, Category
from UserProfiles.models import UserBooked

def home(request):
    ev = Events.objects.all()
    categories = Category.objects.all()
    booked_events = []
    if request.user.is_authenticated:
        booked_events = UserBooked.objects.filter(user=request.user).values_list('ev_id', flat=True)
    
    category_id = request.GET.get('category')
    search_term = request.GET.get('search')

    if category_id:
        ev = ev.filter(cat_id=category_id)
    
    if search_term:
        ev = ev.filter(
            Q(name__icontains=search_term) |
            Q(date__icontains=search_term) |
            Q(location__name__icontains=search_term)
        )

    return render(request, 'base.html', {
        'ev': ev,
        'booked_events': booked_events,
        'categories': categories
    })
