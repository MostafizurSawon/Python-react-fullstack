from django.contrib import admin
from django.urls import path, include

api_urlpatterns = [
    path("users", include("users.urls")),
    path("recipe/", include("recipe.urls")),
    path("contact", include("contact_us.urls")),
]

# v1_urlpatterns = [
#     path("", include("users.urls")),
#     path("", include("categories.urls")),
# ]

# v2_urlpatterns = [
#     path("users/", include("users.urls")),
#     path("categories/", include("categories.urls")),
# ]

# api_urlpatterns = [
#     path("v1/", include(v1_urlpatterns)),
# ]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(api_urlpatterns)),
]
