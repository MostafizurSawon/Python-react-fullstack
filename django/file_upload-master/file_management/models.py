from django.db import models

# Create your models here.
class Document(models.Model):
    title = models.CharField(max_length=100, default="")
    file = models.FileField(upload_to="documents/")
    file2 = models.FileField(upload_to="documents/", null=True, blank=True)
