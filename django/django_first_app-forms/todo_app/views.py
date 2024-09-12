from django.shortcuts import render, redirect
from .models import Task, Book, Author
from django.http import HttpResponse, JsonResponse
from .forms import TaskForm, TaskUpdateForm, BookForm, AuthorForm, BookUpdateForm
from django.forms.models import model_to_dict
from django.contrib.auth.models import User

# Create your views here.

def task_list(request):
    # tasks = Task.objects.filter(completed=True)
    tasks = Task.objects.all()
    completed = request.GET.get("completed")
    if completed == "1":
        tasks = tasks.filter(completed=True)
    elif completed == "0":
        tasks = tasks.filter(completed=False)
    context = {
        "custom": "hidden",
        "tasks": tasks
    }
    return render(request, "task_list.html", context=context)

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

from django.contrib import messages

def update_task_form(request, pk):
    try:
        task = Task.objects.get(pk=pk)

        if request.method == "POST":
            task_form = TaskUpdateForm(request.POST, instance=task)

            if task_form.is_valid():
                task_form.save()
                messages.success(request, "Task updated successfully!")
                return redirect("task_list")
            else:
                context = {
                    "form": task_form,
                }
                return render(request, "update_task.html", context=context)

        task_form = TaskUpdateForm(instance=task)
        context = {
            "form": task_form,
            "page": "Task Update Page"
        }
        return render(request, "update_task.html", context=context)
    except Task.DoesNotExist:
        return HttpResponse("Task does not exist")
    

def task_by_user_id(request, user_id):
    # tasks = Task.objects.filter(user_id=user_id).values()
    # return JsonResponse({"tasks": list(tasks)})
    # ----2----
    # tasks = Task.objects.filter(user_id=user_id)
    # result = []
    # for task in tasks:
    #     result.append({
    #         "title": task.title,
    #         "description": task.description,
    #         "completed": task.completed,
    #         "created_at": task.created_at,
    #         "due_date": task.due_date,
    #         "user_id":task.user.id,
    #         "user":task.user.first_name
    #     })
    # -------------3--------
    user = User.objects.get(pk=user_id)
    # tasks = user.task_set.all().values()
    tasks = user.tasks.all().values()
    return JsonResponse({"tasks": list(tasks)})


# --books and authors one to many relationship ----

def add_author(request):
    if request.method == "POST":
        form = AuthorForm(request.POST)
        if form.is_valid():
            print(form.cleaned_data)
            form.save()
            return redirect("all_books")
        else:
            return render(request, "add_author.html", {"form": form})
    else:
        form = AuthorForm()
        return render(request, "add_author.html", {"form": form})


# def all_books(request):
#     books = Book.objects.all()
#     # return JsonResponse({"books": list(books)})
#     result = []
#     for book in books:
#         result.append(
#             {
#                 "title": book.title,
#                 "description": book.description,
#                 "publication_date": book.publication_date,
#                 "author": f"{book.author.first_name} {book.author.last_name}",
#             }
#         )

#     return JsonResponse({"books": result})


# def book(request, book_id):
#     book = Book.objects.get(pk=book_id)
#     # book_to_json = model_to_dict(book)
#     book_details = {
#         "title":book.title,
#         "description":book.description,
#         "publication_date":book.publication_date,
#         "author":f'{book.author.first_name} {book.author.last_name}'
#     }
#     return JsonResponse({"book": book_details})

def add_book(request):
    if request.method == "POST":
        form = BookForm(request.POST)
        if form.is_valid():
            print(form.cleaned_data)
            form.save()
            return redirect("all_books")
        else:
            return render(request, "add_book.html", {"form": form})
    else:
        form = BookForm()
        return render(request, "add_book.html", {"form": form})



# def author(request, author_id):
#     author = Author.objects.get(pk=author_id)

#     author_details = {
#         "first_name": author.first_name,
#         "last_name": author.last_name,
#         "bio": author.bio,
#         "books": [book.title for book in author.books.all()],
#     }
#     return JsonResponse({"author": author_details})


# ---many to many---

def author(request, author_id):
    author = Author.objects.get(pk=author_id)

    author_details = {
        "first_name": author.first_name,
        "last_name": author.last_name,
        "bio": author.bio,
        "books": [book.title for book in author.books.all()],
    }
    return JsonResponse({"author": author_details})

def book(request, book_id):
    book = Book.objects.get(pk=book_id)
    book_details = {
        "title": book.title,
        "description": book.description,
        "publication_date": book.publication_date,
        "author": [
            f"{author.first_name} {author.last_name} {author.bio}"
            for author in book.author.all()
        ],
    }
    return JsonResponse({"book": book_details})

def update_book_form(request, pk):
    try:
        book = Book.objects.get(pk=pk)

        if request.method == "POST":
            book_form = BookUpdateForm(request.POST, instance=book)
            if book_form.is_valid():
                book_form.save()
                # print("Else context 0")
                return redirect("task_list")

            else:
                # print("Else context")
                context = {
                    "form": book_form,
                }
                return render(request, "update_task.html", context=context)

        book_form = BookUpdateForm(instance=book)
        context = {
            "form": book_form,
            "page": "Book Update"
        }
        # print("Else context 2")
        return render(request, "update_task.html", context=context)
    except Task.DoesNotExist:
        return HttpResponse("Book does not exist")


def all_books(request):
    books = Book.objects.all()
    # return JsonResponse({"books": list(books)})
    result = []
    for book in books:
        result.append(
            {
                "title": book.title,
                "description": book.description,
                "publication_date": book.publication_date,
                # "author_ids":[
                #     author.id for author in book.author.all()
                # ],
                # "author": [
                #     f"{author.first_name} {author.last_name}"
                #     for author in book.author.all()
                # ]
                "authors":[
                    {
                        "id":author.id,
                        "first_name":author.first_name,
                        "last_name":author.last_name,
                        "Bio":author.bio
                    } for author in book.author.all()
                ]
            }
        )

    return JsonResponse({"books": result})