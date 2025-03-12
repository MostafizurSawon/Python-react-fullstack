from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework import filters, pagination
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter
from django.db.models import Q
import logging
from . import models
from . import serializers

# Set up logging
logger = logging.getLogger(__name__)

# Custom FilterSet for Recipe
class RecipeFilter(FilterSet):
    categories = CharFilter(method='filter_categories')
    search = CharFilter(method='filter_search')

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
            Q(title__icontains=value) |
            Q(category__name__icontains=value)
        ).distinct()

# Pagination class (unchanged)
class RecipePagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class CategoryViewset(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # Consistent with RecipeViewset

class RecipeViewset(viewsets.ModelViewSet):
    queryset = models.Recipe.objects.all()
    serializer_class = serializers.RecipeSerializer
    filter_backends = [DjangoFilterBackend]
    pagination_class = RecipePagination
    filterset_class = RecipeFilter
    permission_classes = [IsAuthenticatedOrReadOnly]
    

    def perform_create(self, serializer):
        logger.info(f"Creating recipe for user: {self.request.user}")
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def save(self, request, pk=None):
        recipe = self.get_object()
        user = request.user
        if user in recipe.saved_by.all():
            recipe.saved_by.remove(user)
            logger.info(f"User {user} unsaved recipe {recipe.id}")
            return Response({'status': 'recipe unsaved'})
        else:
            recipe.saved_by.add(user)
            logger.info(f"User {user} saved recipe {recipe.id}")
            return Response({'status': 'recipe saved'})

class ReviewViewset(viewsets.ModelViewSet):
    queryset = models.Review.objects.all()
    serializer_class = serializers.ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        logger.info(f"Creating review for user: {self.request.user}")
        serializer.save(reviewer=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = models.Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['recipe']  # Filter comments by recipe

    def perform_create(self, serializer):
        logger.info(f"Creating comment for user: {self.request.user}")
        serializer.save(user=self.request.user)

class ReactionViewSet(viewsets.ModelViewSet):
    queryset = models.Reaction.objects.all()
    serializer_class = serializers.ReactionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['recipe', 'comment']  # Filter reactions by recipe or comment

    def perform_create(self, serializer):
        logger.info(f"Creating reaction for user: {self.request.user}")
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def react(self, request):
        recipe_id = request.data.get('recipe_id')
        comment_id = request.data.get('comment_id')
        reaction_type = request.data.get('reaction_type')

        if reaction_type not in dict(models.Reaction.REACTION_CHOICES):
            logger.error(f"Invalid reaction type: {reaction_type}")
            return Response({'error': 'Invalid reaction type'}, status=status.HTTP_400_BAD_REQUEST)

        if recipe_id and comment_id:
            logger.error("Attempted to react to both recipe and comment")
            return Response({'error': 'Cannot react to both recipe and comment'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not (recipe_id or comment_id):
            logger.error("No reaction target specified")
            return Response({'error': 'No target specified'}, status=status.HTTP_400_BAD_REQUEST)

        target = None
        existing_reaction = None
        if recipe_id:
            try:
                target = models.Recipe.objects.get(id=recipe_id)
                existing_reaction = models.Reaction.objects.filter(user=request.user, recipe=target).first()
            except models.Recipe.DoesNotExist:
                logger.error(f"Recipe {recipe_id} not found")
                return Response({'error': 'Recipe not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            try:
                target = models.Comment.objects.get(id=comment_id)
                existing_reaction = models.Reaction.objects.filter(user=request.user, comment=target).first()
            except models.Comment.DoesNotExist:
                logger.error(f"Comment {comment_id} not found")
                return Response({'error': 'Comment not found'}, status=status.HTTP_404_NOT_FOUND)

        if existing_reaction:
            if existing_reaction.reaction_type == reaction_type:
                existing_reaction.delete()
                logger.info(f"User {request.user} removed {reaction_type} from {target}")
                return Response({
                    'status': 'reaction removed',
                    'counts': target.get_reaction_counts()
                })
            else:
                existing_reaction.reaction_type = reaction_type
                existing_reaction.save()
                logger.info(f"User {request.user} updated reaction to {reaction_type} on {target}")
                return Response({
                    'status': 'reaction updated',
                    'counts': target.get_reaction_counts()
                })
        else:
            reaction_data = {'user': request.user.id, 'reaction_type': reaction_type}
            if recipe_id:
                reaction_data['recipe'] = recipe_id
            else:
                reaction_data['comment'] = comment_id
            serializer = self.get_serializer(data=reaction_data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            logger.info(f"User {request.user} added {reaction_type} to {target}")
            return Response({
                'status': 'reaction added',
                'counts': target.get_reaction_counts()
            })