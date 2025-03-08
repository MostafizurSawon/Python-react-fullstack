from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


# class CustomProductManager(models.BaseManager):
#     def active_products(self):
#         return self.all().filter(is_active=True)


# class Product(models.Model):
#     ...
#     objects = CustomProductManager()
#     # active_objects = CustomProductManager()


# product.objects.all()  # returns all products
# product.objects.active_products()  # returns only active products

# product.active_objects.all() # returns only active products


# from django.contrib.auth.models import AbstractUser
# class User(AbstractUser):
#     pass


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True)
    firstName = models.CharField(max_length=255)
    lastName = models.CharField(max_length=255)
    password = models.CharField(max_length=25)
    mobile = models.CharField(max_length=14)
    otp = models.CharField(max_length=6, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()


SEX_CHOICES = [
    ('Male', 'Male'),
    ('Female', 'Female'),
]
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    image = models.ImageField(upload_to='users/images/')
    # mobile_no = models.CharField(max_length = 12)
    age = models.IntegerField(default=18)
    portfolio = models.URLField(blank=True)
    sex = models.CharField(choices = SEX_CHOICES, max_length = 10, default="Male")
    bio = models.TextField(blank=True)
    facebook = models.URLField(blank=True)

    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"
