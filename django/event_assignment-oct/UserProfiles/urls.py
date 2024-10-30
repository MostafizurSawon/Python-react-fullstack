from django.urls import path
from .views import UserRegistrationView, UserLoginView, user_logout, MyProfile, update_profile_info_form, UserLogin
 
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLogin, name='login'),
    # path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', user_logout, name='logout'),
    path('profile/', MyProfile, name='profile'),
    path('profile/add-info/', update_profile_info_form, name='profile_info'),
]