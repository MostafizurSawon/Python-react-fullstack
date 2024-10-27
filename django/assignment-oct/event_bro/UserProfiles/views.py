from django.http import HttpResponse
from django.views.generic import FormView
from .forms import UserRegistrationForm, UserProfileForm
from django.contrib.auth import login, logout
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect, get_object_or_404

from .models import UserAccount
# from Events.models import Events
from django.contrib import messages
from django.contrib.auth.decorators import login_required
import random

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User  # Assuming you're using the default User model

# @receiver(post_save, sender=User)
# def create_user_account(sender, instance, created, **kwargs):
#     # When a new User is created, create the corresponding UserAccount, UserSocialAccount, userEducation
#     if created:
#         UserAccount.objects.create(
#             user=instance, 
#             image=random.choice(UserAccount.images),  # Or handle image selection appropriately
#         )
#         UserSocialAccount.objects.create(
#             user=instance, 
#         )
#         UserEducation.objects.create(
#             user=instance,   
#         )


# User Authentication starts here

from django.db import IntegrityError

class UserRegistrationView(FormView):
    template_name = 'user_registration.html'
    form_class = UserRegistrationForm
    success_url = reverse_lazy('login')
    
    def form_valid(self, form):
        user = form.save()  # Save the user from the form

        # Check and create UserAccount if it doesn't already exist
        if not UserAccount.objects.filter(user=user).exists():
            try:
                UserAccount.objects.create(
                    user=user,
                    image=random.choice(UserAccount.images),
                )
            except IntegrityError:
                form.add_error(None, "User account already exists.")
                return self.form_invalid(form)

        
        return super().form_valid(form)

    
class UserLoginView(LoginView):
    template_name = 'user_login.html'
    
    def get_success_url(self):
        # print("logged")
        return reverse_lazy('profile')

@login_required
def user_logout(request):
    logout(request)
    return redirect('login')

# User Authentication ends here



# Profile Section starts here
@login_required
def MyProfile(request):
#   data = UserAccount.objects.all()
    data = get_object_or_404(UserAccount, user=request.user)
    if data:
        return render(request, 'profile.html',  {'data': data})
    else:
        return render(request, 'profile.html')

@login_required
def add_profile_info_form(request):
    if request.method == "POST":
        form = UserProfileForm(request.POST)
        if form.is_valid():
            # if UserAccount.objects.filter(name=request.user).exists():
            #     messages.error(request, "You cannot add more data. An entry already exists for your account.")
            #     return render(request, "add-info.html", {"form": form, "type": "Add"})
            
            form.instance.user = request.user
            form.save()
            messages.success(request, "Data added successfully!")
            return redirect("home")
    else:
        form = UserProfileForm()

    return render(request, "add-info.html", {"form": form, "type": "Add"})


@login_required
def update_profile_info_form(request):
    try:
        data = get_object_or_404(UserAccount, user=request.user)

        if request.method == "POST":
            data_form = UserProfileForm(request.POST, instance=data)

            if data_form.is_valid():
                data_form.save()
                messages.success(request, "Your Data updated successfully!")
                return redirect("profile")
            else:
                context = {
                    "form": data_form,
                    "type": "Update"
                }
                return render(request, "add-info.html", context=context)

        data_form = UserProfileForm(instance=data)
        context = {
            "form": data_form,
            "type": "Update"
        }
        return render(request, "add-info.html", context=context)
    except UserAccount.DoesNotExist:
        return HttpResponse("Employee Data does not exist")
    
    
   
