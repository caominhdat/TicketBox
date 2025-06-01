from django.contrib import admin
from django.template.response import TemplateResponse
from django.utils.safestring import mark_safe
from django import forms
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from .models import Category, Event, TypeTicket, Ticket, Chat, Discount, Payment, CheckIn, Notification, Comment
from django.urls import path
from tickets import dao


class TicketAppAdminSite(admin.AdminSite):
    site_header = 'TicketApp'

    def get_urls(self):
        return  [
            path('ticket-stats/', self.stats_view)
        ] + super().get_urls()


    def stats_view(self, request):
        return TemplateResponse(request, 'admin/stats.html', {
            'stats' : dao.count_events_by_category()
        })


admin_site = TicketAppAdminSite(name='myapp')


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name']
    list_filter = ['id', 'name']


class EventForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)

    class Meta:
        model = Event
        fields = '__all__'

class EventAdmin(admin.ModelAdmin):
    readonly_fields = ['img']
    form = EventForm

    def img(self, event):
        if event:
            return mark_safe(
                '<img src="/static/{url}" width="120" />' \
                .format(url=event.image.name)
            )

    class Media:
        css = {
            'all': ('/static/css/style.css',)
        }

# Register your models here.
admin_site.register(Category, CategoryAdmin)
admin_site.register(Event, EventAdmin)
admin_site.register(TypeTicket)
admin_site.register(Ticket)
admin_site.register(Chat)
admin_site.register(Discount)
admin_site.register(Payment)
admin_site.register(CheckIn)
admin_site.register(Notification)
admin_site.register(Comment)
