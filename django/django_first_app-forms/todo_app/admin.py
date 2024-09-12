from django.contrib import admin
from .models import Task, Author, Book

# Register your models here.
admin.site.register(Task)
admin.site.register(Author)
admin.site.register(Book)