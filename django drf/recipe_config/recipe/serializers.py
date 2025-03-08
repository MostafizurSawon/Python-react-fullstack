from rest_framework import serializers
from . import models

class RecipeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(many=False)  # Display user as string (e.g., username)
    category = serializers.PrimaryKeyRelatedField(many=True, queryset=models.Category.objects.all())  # Allow sending category IDs

    class Meta:
        model = models.Recipe
        fields = '__all__'
        read_only_fields = ['user', 'created_on']  # Ensure these fields are read-only

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Review
        fields = '__all__'
