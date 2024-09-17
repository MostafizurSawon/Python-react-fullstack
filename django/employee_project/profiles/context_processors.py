from main_data.models import E_data

# def add_user_data(request):
#     if request.user.is_authenticated:
#         try:
#             data = E_data.objects.get(name=request.user)
#             print("c context", data)
#         except E_data.DoesNotExist:
#             data = None
#     else:
#         data = None

#     return {'data': data}
  
def user_data(request):
    if request.user.is_authenticated:
        try:
            data = E_data.objects.get(name=request.user)
            # print("c context", data)
        except E_data.DoesNotExist:
            data = None
        return {'base': data, "user": request.user}
    return {}
