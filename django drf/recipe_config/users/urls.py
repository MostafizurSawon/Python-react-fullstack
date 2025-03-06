from django.urls import path

from .views import (
    UserRegistrationView,
    UserLoginView,
    SendOTPView,
    VerifyOTPView,
    ResetPasswordView,
    UserProfileView,
    UserProfileUpdateView,
)


urlpatterns = [
    path(
        "register",
        UserRegistrationView.as_view(),
        name="user-registration",
    ),
    path(
        "login/",
        UserLoginView.as_view(),
        name="user-login",
    ),
    path(
        "send-otp",
        SendOTPView.as_view(),
        name="send-otp",
    ),
    path(
        "verify-otp",
        VerifyOTPView.as_view(),
        name="verify-otp",
    ),
    path(
        "reset-password",
        ResetPasswordView.as_view(),
        name="reset-password",
    ),
    path(
        "user-profile",
        UserProfileView.as_view(),
        name="user-profile",
    ),
    path(
        "user-update",
        UserProfileUpdateView.as_view(),
        name="user-update",
    ),
]


# localhost:8000/
# api/
# user-registration
