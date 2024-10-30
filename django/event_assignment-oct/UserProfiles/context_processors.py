from .models import UserAccount
from django.shortcuts import get_object_or_404
from django.db import IntegrityError
import random

def user_data(request):
    if request.user.is_authenticated:
        try:
            user_account, created = UserAccount.objects.get_or_create(
                user=request.user,
                defaults={
                    'image': random.choice(UserAccount.images)
                }
            )
            
            return {
                'data': user_account,
            }

        except (UserAccount.DoesNotExist):
            return {}

        except IntegrityError:
            return {}

    return {}
