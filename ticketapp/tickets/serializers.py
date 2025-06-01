from tickets.models import Category, Event, TypeTicket, User, Comment, Discount
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(source='image')

    def get_image(self, category):
        if category.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri('/static/%s' % category.image.name)
            return '/static/%s' % category.image.name

    class Meta:
        model = Category
        fields  = '__all__'


class EventSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(source='image')

    def get_image(self, event):
        if event.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri('/static/%s' % event.image.name)
            return '/static/%s' % event.image.name

    class Meta:
        model = Event
        fields = '__all__'


class TypeTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeTicket
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'password', 'email', 'avatar']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data['password'])
        user.save()

        return user


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = Comment
        fields = ['id', 'content', 'user']


class BannerSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField(source='image')

    def get_image(self, event):
        if event.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri('/static/%s' % event.image.name)
            return '/static/%s' % event.image.name

    class Meta:
        model = Event
        fields = ['id', 'image']


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['name', 'code', 'percent']