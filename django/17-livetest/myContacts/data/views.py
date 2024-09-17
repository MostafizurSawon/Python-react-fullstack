from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Cdata
from .forms import DataForm, DataUpdateForm

# Create your views here.
def home(request):
    query = request.GET.get('q')  # Capture the search query if it exists
    if query:
        data = Cdata.objects.filter(first_name__icontains=query)  # Filter by name
    else:
        data = Cdata.objects.all()  # Show all data if no query

    return render(request, 'home.html', {'data': data, 'query': query})


def contact_details(request, pk):
    try:
        contact = Cdata.objects.get(pk=pk)
        return render(request, "contact_detail.html", {"data": contact})
    except Cdata.DoesNotExist:
        return HttpResponse("Contact does not exist")

def add_data_form(request):
    if request.method == "POST":
        form = DataForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("homepage")
    else:
        form = DataForm()

    return render(request, "add_data.html", {"form": form, "type": "Add"})
  

def update_data_form(request, pk):
    try:
        data = Cdata.objects.get(pk=pk)

        if request.method == "POST":
            data_form = DataUpdateForm(request.POST, instance=data)

            if data_form.is_valid():
                data_form.save()
                return redirect("homepage")
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
    except Cdata.DoesNotExist:
        return HttpResponse("Employee Data does not exist")
    
    

def delete_data(request, pk):
    try:
        data = Cdata.objects.get(pk=pk)
        data.delete()
        return redirect("homepage")
    except Cdata.DoesNotExist:
        return HttpResponse("Data does not exist")