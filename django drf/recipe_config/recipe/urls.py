from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RecipeViewset,
    CategoryViewset,
    ReviewViewset,
    CommentViewSet,
    ReactionViewSet
)

router = DefaultRouter()
router.register('lists', RecipeViewset, basename='recipe')
router.register('categories', CategoryViewset, basename='category')
router.register('reviews', ReviewViewset, basename='review')
router.register('comments', CommentViewSet, basename='comment')
router.register('reactions', ReactionViewSet, basename='reaction')

urlpatterns = [
    path('', include(router.urls)),
]

if settings.DEBUG:
    from django.conf import settings
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)