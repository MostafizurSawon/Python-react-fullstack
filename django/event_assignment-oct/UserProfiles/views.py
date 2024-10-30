from django.http import HttpResponse
from django.views.generic import FormView
from Events.models import Events
from .forms import UserRegistrationForm, UserProfileForm
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import AuthenticationForm
from .models import UserAccount
from django.contrib import messages
from django.contrib.auth.decorators import login_required
import random
from django.contrib.auth.models import User  
from django.db import IntegrityError

class UserRegistrationView(FormView):
    template_name = 'user_registration.html'
    form_class = UserRegistrationForm
    success_url = reverse_lazy('login')
    
    def form_valid(self, form):
        user = form.save()  

        if not UserAccount.objects.filter(user=user).exists():
            try:
                UserAccount.objects.create(
                    user=user,
                    image=random.choice(UserAccount.images),
                )
                messages.success(self.request, f"Registration successful, you can login now!")
            except IntegrityError:
                form.add_error(None, "User account already exists.")
                return self.form_invalid(form)

        
        return super().form_valid(form)

    
class UserLoginView(LoginView):
    template_name = 'user_login.html'
    
    def get_success_url(self):
        # print("logged")
        return reverse_lazy('profile')
    
def UserLogin(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                if request.user.is_superuser:
                    messages.success(request, f"Welcome, Mr. {user}, you are an Administrator!")
                else:
                    messages.success(request, f"Welcome Mr. {user} to your account!")
                return redirect(reverse_lazy('profile'))
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid login details. Please try again.")
    else:
        form = AuthenticationForm()
    
    return render(request, 'user_login.html', {'form': form})

@login_required
def user_logout(request):
    logout(request)
    messages.success(request, f"Logged out successfully!")
    return redirect('login')

# User Authentication ends here



# Profile Section starts here
@login_required
def MyProfile(request):
    ev = Events.objects.filter(owner=request.user)
    
    if request.user.is_superuser:
        ev = Events.objects.all()
        # messages.success(request, f"Welcome Admin!")
        
    return render(request, 'profile.html', {'ev': ev})

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
                messages.success(request, "Your Profile Data updated successfully!")
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
    
    
   
