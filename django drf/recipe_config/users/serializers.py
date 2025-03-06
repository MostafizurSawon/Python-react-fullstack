from rest_framework import serializers

# from django.contrib.auth import get_user_model
# User = get_user_model()

from .models import User


# class UserRegistrationSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(required=True)

#     class Meta:
#         model = User
#         fields = [
#             "email",
#             "firstName",
#             "lastName",
#             "password",
#             "mobile",
#         ]

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation.setdefault('email', '')
#         representation.setdefault('firstName', '')
#         representation.setdefault('lastName', '')
#         representation.setdefault('password', '')
#         representation.setdefault('mobile', '')
#         return representation

#     def create(self, validated_data):
#         password = validated_data.pop("password")
#         user = User(**validated_data)
#         user.set_password(password)
#         user.save()
#         return user


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required = True)
    class Meta:
        model = User
        fields = [
            "email",
            "firstName",
            "lastName",
            "password",
            "mobile",
        ]
        # extra_kwargs = {
        #     'email': {'default': ''},
        #     'firstName': {'default': ''},
        #     'lastName': {'default': ''},
        #     'password': {'default': ''},
        #     'mobile': {'default': ''}
        # }

    def create(self, validated_data):
        # Path 1
        # user = User(
        #     firstName=validated_data["firstName"],
        #     lastName=validated_data["lastName"],
        #     email=validated_data["email"],
        #     mobile=validated_data["mobile"],
        # )
        # user.set_password(validated_data["password"])
        # user.save()

        # Path 2
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()

        # Path 3
        # user = User.objects.create_user(
        #     firstName=validated_data["firstName"],
        #     lastName=validated_data["lastName"],
        #     email=validated_data["email"],
        #     mobile=validated_data["mobile"],
        #     password=validated_data["password"],
        # )

        # Path 4
        # user = User.objects.create_user(**validated_data)

        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "email",
            "firstName",
            "lastName",
            "mobile",
            # "password",
        ]
        extra_kwargs = {
            "email": {"read_only": True},
            # "password": {"write_only": True},
        }
