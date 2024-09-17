from django.urls import path, include
from . import views
# from profiles.views import profile_nav

urlpatterns = [
    path("", views.home, name="homepage"),
    # path("", profile_nav, name='profile_nav'),
    path("add-data/", views.add_data_form, name="add_data"),
    path("update/<int:pk>/", views.update_data_form, name="update_data_form"),
    path("update-by-admin/<int:pk>/", views.update_data_form_admin, name="update_data_form_admin"),
    
    path('delete/<int:pk>', views.delete_data, name='delete_data'),
    path('delete-id/', views.delete_user_data, name='delete_user_data'),
]
