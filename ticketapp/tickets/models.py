from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    pass


class BaseModel(models.Model):
    created_date = models.DateField(auto_now_add=True, null=True)
    updated_date = models.DateField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True #lop truu tuong khong tao instance


class Category(BaseModel):
    name = models.CharField(max_length=50, null=False)

    def __str__(self):
        return self.name


class Event(BaseModel):
    name = models.CharField(max_length=100, null=False)
    description =models.TextField()
    image = models.CharField(max_length=100)
    category =models.ForeignKey(Category, on_delete=models.CASCADE) # Category xoa thi event xoa

    def __str__(self):
        return self.name