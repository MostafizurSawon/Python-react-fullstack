from django.shortcuts import render
from posts.models import Post
from categories.models import Category

def home(request):
    data = Post.objects.all()
    
    search_term = request.GET.get('search', '')

    if search_term:
        data = data.filter(title__icontains=search_term) | data.filter(category__name__icontains=search_term)

    return render(request, 'home.html', {'data': data})
