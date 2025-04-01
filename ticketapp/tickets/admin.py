from django.contrib import admin
from django.utils.safestring import mark_safe

from .models import Category, Event, TypeTicket, Ticket, Chat, Discount, Payment, CheckIn, Review, Notification

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name']
    list_filter = ['id', 'name']


class EventAdmin(admin.ModelAdmin):
    readonly_fields = ['img']

    def img(self, event):
        if event:
            return mark_safe(
                '<img src="/static/{url}" width="120" />' \
                .format(url=event.image.name)
            )


# Register your models here.
admin.site.register(Category, CategoryAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(TypeTicket)
admin.site.register(Ticket)
admin.site.register(Chat)
admin.site.register(Discount)
admin.site.register(Payment)
admin.site.register(CheckIn)
admin.site.register(Review)
admin.site.register(Notification)
