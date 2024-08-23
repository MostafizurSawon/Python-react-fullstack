from django.shortcuts import render
from .models import Task 

# Create your views here.

# py manage.py loaddata 

def task_list(request):
    # tasks = Task.objects.filter(title='This is a new task')
    tasks = Task.objects.all()
    completed = request.GET.get("completed")
    print(completed)
    if completed == 'yes':
        tasks = tasks.filter(completed=True)
    elif completed == 'no':
        tasks = tasks.filter(completed=False)
    return render(request, 'task_list.html', {"tasks":tasks})

def task_details(request, pk):
    task = Task.objects.get(pk=pk)
    return render(request, 'task_detail.html', {"task":task})