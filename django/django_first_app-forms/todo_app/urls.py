from django.urls import path
from . import views

urlpatterns = [
    path('', views.task_list,name='task_list'),
    path('<int:pk>/', views.task_details, name='task_details'),
    path('<int:pk>/like', views.task_like, name='task_like'),
    path('<int:pk>/dislike', views.task_dislike, name='task_dislike'),
    path('add/', views.add_task, name='add_task'),
    path('delete/<int:pk>', views.delete_task, name='delete_task'),
    path('update/', views.update_task, name='update_task'),
    path('form/', views.add_task_form, name='form'),
    path("update/<int:pk>/", views.update_task_form, name="update_form"),
    path('user/<int:user_id>', views.task_by_user_id, name="user_tasks"),
    
    path('books/', views.all_books, name="all_books"),
    path('books/add-book/', views.add_book, name="add_book"),
    path('books/add-author/', views.add_author, name="add_author"),
    
    
    path('books/<int:book_id>', views.book, name="book"),
    path('author/<int:author_id>', views.author, name="author")
]

