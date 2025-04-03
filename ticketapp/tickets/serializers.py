from tickets.models import Category, Event, TypeTicket
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
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