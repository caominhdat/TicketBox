from rest_framework import viewsets, generics
from tickets import serializers, paginators
from tickets.models import Category, Event

# Create your views here.
class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer


class EventViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Event.objects.filter(active=True).all()
    serializer_class = serializers.EventSerializer
    pagination_class = paginators.EventPaginator