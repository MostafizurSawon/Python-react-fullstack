from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    RecipeViewset,
    CategoryViewset,
    ReviewViewset
)

# router = DefaultRouter() # amader router

# router.register('list', views.RecipeViewset) # router er antena
# router.register('category', views.CategoryViewset)
# router.register('reviews', views.ReviewViewset) 

# urlpatterns = [
#     path('', include(router.urls)),
# ]

urlpatterns = [
    path(
        "list",
        RecipeViewset.as_view({'get': 'list', 'post': 'create'}),
        name="recipe_list",
    ),
    path(
        "category",
        CategoryViewset.as_view({'get': 'list', 'post': 'create'}),
        name="category_list",
    ),
    path(
        "review",
        ReviewViewset.as_view({'get': 'list', 'post': 'create'}),
        name="review_list",
    ),
]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
