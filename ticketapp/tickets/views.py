from rest_framework import viewsets, generics, status
from rest_framework.response import Response

from tickets import serializers, paginators
from rest_framework.decorators import action
from tickets.models import Category, Event

# Create your views here.
class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer

    def get_queryset(self):
        queries = self.queryset
        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(name__icontains=q)

        return queries


class EventViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Event.objects.filter(active=True).all()
    serializer_class = serializers.EventSerializer
    pagination_class = paginators.EventPaginator

    def get_queryset(self):
        queries = self.queryset
        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(name__icontains=q)

        return queries

    @action(methods=['get'], detail=True)
    def type_ticket(self, request, pk):
        type_ticket = self.get_object().typeticket_set.filter(active=True).all()

        return Response(serializers.TypeTicketSerializer(type_ticket, many=True).data, status=status.HTTP_200_OK)