from rest_framework import serializers
from . import models
from users.serializers import UserProfileSerializer

class RecipeSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)  # Read-only nested serializer
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.Category.objects.all(),
        many=True,
        write_only=True  # Accept IDs during write
    )
    category_names = serializers.StringRelatedField(
        source='category',
        many=True,
        read_only=True  # Return names on read
    )

    class Meta:
        model = models.Recipe
        fields = '__all__'
        read_only_fields = ['user', 'created_on']

    def to_representation(self, instance):
        # Customize output to include category names
        ret = super().to_representation(instance)
        ret['category'] = ret.pop('category_names', [])
        return ret

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = '__all__'

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Review
        fields = '__all__'