# users/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login,  logout
from django.contrib.auth.models import User
from .forms import LoginForm, OTPForm, ProfileForm, RegistrationForm
from django.contrib.auth.decorators import login_required
from .models import UserOTP,Profile
import random

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            # Authenticate user
            user = form.get_user()
            # Generate OTP
            otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
            # Save OTP to UserOTP model
            user_otp, created = UserOTP.objects.get_or_create(user=user)
            user_otp.otp = otp
            user_otp.save()
            # Optionally, send OTP via SMS or Email here
            # For demonstration, we'll print it to the console
            print(f"OTP for {user.username}: {otp}")
            # Store user's ID in session for OTP verification
            request.session['pre_otp_user_id'] = user.id
            # Pass the OTP to the OTP verification form
            return redirect('otp_verify')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})

def otp_verify_view(request):
    user_id = request.session.get('pre_otp_user_id')
    if not user_id:
        return redirect('login')
    try:
        user = User.objects.get(id=user_id)
        user_otp = UserOTP.objects.get(user=user)
    except User.DoesNotExist:
        return redirect('login')
    except UserOTP.DoesNotExist:
        return redirect('login')
    
    if request.method == 'POST':
        form = OTPForm(request.POST)
        if form.is_valid():
            otp_entered = form.cleaned_data['otp']
            if user_otp.otp == otp_entered:
                # OTP is correct
                user_otp.otp = ''
                user_otp.save()
                login(request, user)  # Log the user in
                del request.session['pre_otp_user_id']
                return redirect('home')  # Redirect to a success page
            else:
                form.add_error('otp', 'Invalid OTP')
    else:
        form = OTPForm()
    return render(request, 'otp_verify.html', {'form': form, 'otp': user_otp.otp})

@login_required
def home_view(request):
    return render(request, 'home.html')

@login_required
def logout_view(request):
    """
    Logs out the current user and redirects to the login page.
    """
    logout(request)
    return redirect('login')

@login_required
def profile_update_view(request):
    """
    Allows the logged-in user to update their profile information.
    """
    try:
        profile = request.user.profile
    except Profile.DoesNotExist:
        profile = Profile.objects.create(user=request.user)
    
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            return redirect('profile_update')  # Redirect to the same page or any other page
    else:
        form = ProfileForm(instance=profile)
    return render(request, 'profile_update.html', {'form': form})

def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()  # Saves the user incorporating the form data
            login(request, user)  # Optional: Logs the user in immediately after registration
            return redirect('home')  # Redirects to home page after successful registration
    else:
        form = RegistrationForm()
    return render(request, 'register.html', {'form': form})

# How to register a user manually with username and password
# def register_user_manually(request):
#     if request.method == 'POST':
#         username = request.POST.get('username')
#         password = request.POST.get('password')
#         if username and password:
#             user = User.objects.create_user(username=username, password=password)
#             login(request, user)
#             return redirect('home')
#     return render(request, 'register_manually.html')
# users/forms.py

# how to update an existing user password manually
# def update_password(request):
#     if request.method == 'POST':
#         user = request.user
#         password = request.POST.get('password')
#         if password:
#             user.set_password(password)
#             user.save()
#             login(request, user)
#             return redirect('home')
#     return render(request, 'update_password.html')

