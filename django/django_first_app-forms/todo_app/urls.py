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
]

