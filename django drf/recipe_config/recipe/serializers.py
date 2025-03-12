from rest_framework import serializers
from . import models
from users.serializers import UserProfileSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = '__all__'

class RecipeSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)  # Nested user info, read-only
    category = serializers.PrimaryKeyRelatedField(
        queryset=models.Category.objects.all(),
        many=True,
        write_only=True  # Accept category IDs for input
    )
    category_names = serializers.StringRelatedField(
        source='category',
        many=True,
        read_only=True  # Return category names for output
    )
    reaction_counts = serializers.SerializerMethodField()  # Add reaction counts
    user_reaction = serializers.SerializerMethodField()   # Add user's current reaction
    saved = serializers.SerializerMethodField()           # Add saved status

    class Meta:
        model = models.Recipe
        fields = [
            'id', 'title', 'ingredients', 'category', 'category_names', 'user',
            'img', 'instructions', 'created_on', 'reaction_counts', 'user_reaction', 'saved'
        ]
        read_only_fields = ['user', 'created_on', 'reaction_counts', 'user_reaction', 'saved']

    def to_representation(self, instance):
        # Customize output to use category_names instead of category IDs
        ret = super().to_representation(instance)
        ret['category'] = ret.pop('category_names', [])
        return ret

    def get_reaction_counts(self, obj):
        return obj.get_reaction_counts()

    def get_user_reaction(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            reaction = models.Reaction.objects.filter(recipe=obj, user=user).first()
            return reaction.reaction_type if reaction else None
        return None

    def get_saved(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            return user in obj.saved_by.all()
        return False

class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserProfileSerializer(read_only=True)  # Nested reviewer info

    class Meta:
        model = models.Review
        fields = ['id', 'reviewer', 'recipe', 'body', 'created', 'rating']
        read_only_fields = ['reviewer', 'created']

    def validate(self, data):
        # Ensure one review per user per recipe
        request = self.context['request']
        if request.method == 'POST':
            recipe = data['recipe']
            if models.Review.objects.filter(reviewer=request.user, recipe=recipe).exists():
                raise serializers.ValidationError("You have already reviewed this recipe.")
        return data

class CommentSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)  # Nested user info
    reaction_counts = serializers.SerializerMethodField()  # Add reaction counts
    user_reaction = serializers.SerializerMethodField()   # Add user's current reaction

    class Meta:
        model = models.Comment
        fields = ['id', 'user', 'recipe', 'content', 'created', 'reaction_counts', 'user_reaction']
        read_only_fields = ['user', 'created', 'reaction_counts', 'user_reaction']

    def get_reaction_counts(self, obj):
        return obj.get_reaction_counts()

    def get_user_reaction(self, obj):
        user = self.context['request'].user
        if user.is_authenticated:
            reaction = models.Reaction.objects.filter(comment=obj, user=user).first()
            return reaction.reaction_type if reaction else None
        return None

class ReactionSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)  # Nested user info

    class Meta:
        model = models.Reaction
        fields = ['id', 'user', 'recipe', 'comment', 'reaction_type']
        read_only_fields = ['user']

    def validate(self, data):
        # Ensure one reaction per user per target (recipe or comment)
        request = self.context['request']
        recipe = data.get('recipe')
        comment = data.get('comment')

        if not (recipe or comment):
            raise serializers.ValidationError("Must specify either a recipe or comment.")
        if recipe and comment:
            raise serializers.ValidationError("Cannot react to both a recipe and comment.")

        if recipe and models.Reaction.objects.filter(user=request.user, recipe=recipe).exists():
            raise serializers.ValidationError("You have already reacted to this recipe.")
        if comment and models.Reaction.objects.filter(user=request.user, comment=comment).exists():
            raise serializers.ValidationError("You have already reacted to this comment.")

        return data