from django.urls import path, include
from . import views

urlpatterns = [
    path("", views.home, name="homepage"),
    path("add-data/", views.add_data_form, name="add_data"),
    path("update/<int:pk>/", views.update_data_form, name="update_data_form"),
    path('delete/<int:pk>', views.delete_data, name='delete_data'),
]
