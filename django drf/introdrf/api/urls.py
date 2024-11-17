from django.urls import path
from .views import hello, task_list, task_detail
from .views import TaskList, TaskDetail, TaskViewSet, AuthorViewSet, BookViewSet
from rest_framework.routers import DefaultRouter

urlpatterns = [
    path('hello/', hello),
    # path('tasks/', task_list),
    # path('tasks/<int:pk>/', task_detail),
    
    # path('tasks/', TaskList.as_view()),
    # path('tasks/<int:pk>/', TaskDetail.as_view()),
    
]

router = DefaultRouter()
router.register('tasks', TaskViewSet, basename='task')
router.register('authors', AuthorViewSet, basename='author')
router.register('books', BookViewSet, basename='book')
urlpatterns += router.urls
