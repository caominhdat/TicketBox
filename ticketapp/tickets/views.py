from pickle import FALSE

from rest_framework import viewsets, generics, status, parsers, permissions
from rest_framework.response import Response

from tickets import serializers, paginators
from rest_framework.decorators import action
from tickets.models import Category, Event, User, Comment, Discount
from tickets import perms


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


class EventViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Event.objects.filter(active=True).all()
    serializer_class = serializers.EventSerializer
    pagination_class = paginators.EventPaginator
    lookup_field = 'pk'

    def get_permissions(self):
        if self.action in ['add_comment']:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

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

    @action(methods=['get', 'post'], url_path='comments', detail=True)
    def add_comment(self, request, pk):
        if request.method == 'POST':
            s = serializers.CommentSerializer(data={
                'user':request.user.pk,
                'event': pk,
                'content': request.data.get('content')
            })
            s.is_valid(raise_exception=True)
            c = s.save()
            return Response(serializers.CommentSerializer(c).data, status = status.HTTP_201_CREATED)

        comments = self.get_object().comment_set.select_related ('user').filter(active=True)
        return Response(serializers.CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)


class CommentViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    permission_classes = [perms.OwnerAuthenticated]


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True).all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_permissions(self):
        if action.__eq__('current_user'):
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=['get'], url_name='current-user', detail=False)
    def current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)


class BannerViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Event.objects.order_by('-created_date')[:3]
    serializer_class = serializers.BannerSerializer

    def get_queryset(self):
        return self.queryset


class DiscountViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Discount.objects.all()
    serializer_class = serializers.DiscountSerializer

    def get_queryset(self):
        queries = self.queryset
        q = self.request.query_params.get("q")
        if q:
            queries = queries.filter(name__icontains=q)
        return queries