from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
# from django.dispatch import receiver


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    mobile_number = models.CharField(max_length=15)
    address = models.TextField()

    def __str__(self):
        return f"{self.user.username}'s profile"

# Automatically create or update Profile whenever User is created or saved
# @receiver(post_save, sender=User)
# def create_or_update_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.get_or_create(user=instance)
#     else:
#         instance.profile.save()


class UserOTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s OTP"