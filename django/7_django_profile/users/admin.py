from django.contrib import admin
from .models import Profile, UserOTP
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Define an inline admin descriptor for Profile
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'

# Define an inline admin descriptor for UserOTP
class UserOTPInline(admin.StackedInline):
    model = UserOTP
    can_delete = False
    verbose_name_plural = 'User OTP'

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    # inlines = (ProfileInline, UserOTPInline)
    inlines = [ProfileInline]

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)