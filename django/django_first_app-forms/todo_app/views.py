from django.shortcuts import render, redirect
from .models import Task
from django.http import HttpResponse
from .forms import TaskForm, TaskUpdateForm

# Create your views here.

def task_list(request):
    # tasks = Task.objects.filter(completed=True)
    tasks = Task.objects.all()
    completed = request.GET.get("completed")
    if completed == "1":
        tasks = tasks.filter(completed=True)
    elif completed == "0":
        tasks = tasks.filter(completed=False)
    return render(request, "task_list.html", {"tasks": tasks})

def task_like(request,pk):
    # print('hellooooo',pk)
    task = Task.objects.get(pk=pk)
    task.like+=1
    task.save()
    
    return redirect("task_details", pk=pk) 

def task_dislike(request,pk):
    # print('hellooooo',pk)
    task = Task.objects.get(pk=pk)
    task.dislike+=1
    task.save()
    
    return redirect("task_details", pk=pk) 


def task_details(request, pk):
    try:
        task = Task.objects.get(pk=pk)
        return render(request, "task_detail.html", {"task": task})
    except Task.DoesNotExist:
        return HttpResponse("Task does not exist")


def add_task(request):
    _title = "Let's have dinner together X"
    _description = "Dinner invitation at Chefs Table X"
    _completed = False
    _due_date = "2024-08-28"
    task = Task(
        title=_title, description=_description, completed=_completed, due_date=_due_date
    )
    task.save()
    # return HttpResponse("Adding Task");
    return redirect("task_list")

    # CRUD


def delete_task(request, pk):
    try:
        task = Task.objects.get(pk=pk)
        task.delete()
        return redirect("task_list")
    except Task.DoesNotExist:
        return HttpResponse("Task does not exist")


def update_task(request):
    task = Task.objects.get(pk=5)
    task.title = "This is a modified task title"
    task.save()
    return redirect("task_list")


def add_task_form(request):
    if request.method == "POST":
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("task_list")
        else:
            return render(request, "add_task.html", {"formx": form})
    else:
        form = TaskForm()
        return render(request, "add_task.html", {"formx": form})


def update_task_form(request, pk):
    try:
        task = Task.objects.get(pk=pk)

        if request.method == "POST":
            task_form = TaskUpdateForm(request.POST, instance=task)
            if task_form.is_valid():
                task_form.save()
                return redirect("task_list")
            else:
                context = {
                    "form": task_form,
                }
                return render(request, "update_task.html", context=context)

        task_form = TaskUpdateForm(instance=task)
        return render(request, "update_task.html", {"form": task_form})
    except Task.DoesNotExist:
        return HttpResponse("Task does not exist")