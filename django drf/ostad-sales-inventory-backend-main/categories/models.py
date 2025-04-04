from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


# user.category_set
# user.categories
class Category(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.RESTRICT,
        # related_name="categories",
        # to_field="username",
    )  # user_id -> User objects ID (pk)
    name = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
