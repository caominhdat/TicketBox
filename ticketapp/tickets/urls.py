from django.urls import path, include
from rest_framework import routers
from tickets import views

routers = routers.DefaultRouter()
routers.register('categories', views.CategoryViewSet, basename='categories')
routers.register('events', views.EventViewSet, basename='events')
routers.register('users', views.UserViewSet, basename='users')

urlpatterns = [
    path('', include(routers.urls))
]