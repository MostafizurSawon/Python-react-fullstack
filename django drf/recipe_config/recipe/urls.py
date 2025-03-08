from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    RecipeViewset,
    CategoryViewset,
    ReviewViewset
)

from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import RecipeViewset, CategoryViewset, ReviewViewset

router = DefaultRouter()  # Initialize the router

router.register('lists', RecipeViewset, basename='recipe')  # Register the RecipeViewset
router.register('categories', CategoryViewset, basename='category')  # Register the CategoryViewset
router.register('reviews', ReviewViewset, basename='review')  # Register the ReviewViewset

urlpatterns = [
    path('', include(router.urls)),  # Include the router's URLs
]


# urlpatterns = [
#     path(
#         "list",
#         RecipeViewset.as_view({'get': 'list', 'post': 'create'}),
#         name="recipe_list",
#     ),
#     path(
#         "category",
#         CategoryViewset.as_view({'get': 'list', 'post': 'create'}),
#         name="category_list",
#     ),
#     path(
#         "review",
#         ReviewViewset.as_view({'get': 'list', 'post': 'create'}),
#         name="review_list",
#     ),
# ]

from django.conf import settings
from django.conf.urls.static import static

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
