from django.shortcuts import render
from rest_framework import viewsets
from . import models
from . import serializers
from rest_framework import filters, pagination
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from django.db.models import Q
import logging

# Set up logging
logger = logging.getLogger(__name__)

# Custom FilterSet for Recipe
class RecipeFilter(FilterSet):
    categories = CharFilter(method='filter_categories')
    search = CharFilter(method='filter_search')  # Add search filter

    def filter_categories(self, queryset, name, value):
        logger.info(f"Filtering recipes by categories: {value}")
        if not value:
            return queryset
        category_names = [cat.strip() for cat in value.split(',')]
        query = Q()
        for cat_name in category_names:
            query |= Q(category__name__iexact=cat_name)
        return queryset.filter(query).distinct()

    def filter_search(self, queryset, name, value):
        logger.info(f"Searching recipes with query: {value}")
        if not value:
            return queryset
        return queryset.filter(
            Q(title__icontains=value) |  # Search in title
            Q(category__name__icontains=value)  # Search in category name
        ).distinct()

class CategoryViewset(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer

class RecipePagination(pagination.PageNumberPagination):
    page_size = 10  # items per page
    page_size_query_param = 'page_size'
    max_page_size = 100

class RecipeViewset(viewsets.ModelViewSet):
    queryset = models.Recipe.objects.all()
    serializer_class = serializers.RecipeSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = RecipePagination
    filterset_class = RecipeFilter
    permission_classes = [IsAuthenticatedOrReadOnly]  # Ensure authentication

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReviewViewset(viewsets.ModelViewSet):
    queryset = models.Review.objects.all()
    serializer_class = serializers.ReviewSerializer