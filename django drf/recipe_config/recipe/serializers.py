from rest_framework import serializers
from . import models
from users.serializers import UserProfileSerializer  # ✅ Import the correct user serializer

class RecipeSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)  # ✅ Use nested serializer for full user details
    category = serializers.StringRelatedField(many=True)  # ✅ Return category names as a list

    class Meta:
        model = models.Recipe
        fields = '__all__'
        read_only_fields = ['user', 'created_on'] 

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Review
        fields = '__all__'
        
# pip install django-filter