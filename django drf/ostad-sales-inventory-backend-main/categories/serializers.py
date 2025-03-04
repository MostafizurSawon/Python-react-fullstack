from rest_framework import serializers

from .models import Category


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = [
            "id",
            "user_id",
            "name",
            "created_at",
            "updated_at",
        ]

    # def create(self, validated_data):
    #     validated_data["user_id"] = self.context["request"].user.id
    #     return super().create(validated_data)
