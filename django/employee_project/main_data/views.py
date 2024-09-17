from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from .forms import DataForm, DataUpdateForm
from django.contrib.auth.decorators import login_required
from .models import E_data

# Create your views here.
def home(request):
  data = E_data.objects.all()
  return render(request, 'home.html', {'data': data})

@login_required
def add_data_form(request):
    if request.method == "POST":
        form = DataForm(request.POST)
        if form.is_valid():
            if E_data.objects.filter(name=request.user).exists():
                messages.error(request, "You cannot add more data. An entry already exists for your account.")
                return render(request, "add_data.html", {"form": form, "type": "Add"})
            
            form.instance.name = request.user
            form.save()
            messages.success(request, "Data added successfully!")
            return redirect("homepage")
    else:
        form = DataForm()

    return render(request, "add_data.html", {"form": form, "type": "Add"})
  
@login_required
def update_data_form(request, pk):
    try:
        data = E_data.objects.get(pk=pk)

        if request.method == "POST":
            data_form = DataUpdateForm(request.POST, instance=data)

            if data_form.is_valid():
                data_form.save()
                messages.success(request, "Employee data updated successfully!")
                return redirect("profile")
            else:
                context = {
                    "form": data_form,
                    "type": "Update"
                }
                return render(request, "add_data.html", context=context)

        data_form = DataUpdateForm(instance=data)
        context = {
            "form": data_form,
            "type": "Update"
        }
        return render(request, "add_data.html", context=context)
    except E_data.DoesNotExist:
        return HttpResponse("Employee Data does not exist")
    
@login_required
def delete_data(request, pk):
    try:
        data = E_data.objects.get(pk=pk)
        data.delete()
        return redirect("profile")
    except E_data.DoesNotExist:
        return HttpResponse("Data does not exist")
    
    
@login_required
def delete_user_data(request):
    user = request.user
    if request.method == 'POST':
        user.delete()
        return redirect('homepage') 

    return render(request, 'confirm.html')