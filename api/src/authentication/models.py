from django.contrib.auth.models import AbstractUser
from django.db import models


class Department(models.Model):
    """Department model for organizing users"""
    name = models.CharField(max_length=255, unique=True)
    code = models.CharField(max_length=50, unique=True, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class User(AbstractUser):
    """Custom user model extending Django's AbstractUser"""
    department = models.ForeignKey(
        Department,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users'
    )

    def __str__(self):
        return self.username
