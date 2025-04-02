from django.db.models import Count

from .models import Category, Event


def load_events(params=None):
    if params is None:
        params = {}

    q = Event.objects.filter(active=True)

    kw = params.get('kw')
    if kw:
        q = q.filter(name__icontains=kw)

    cate_id = params.get('cate_id')
    if cate_id:
        q = q.filter(category_id=cate_id)

    return q


def count_events_by_category():
    return Category.objects.annotate(count=Count('events__id')).values("id", "name", "count").order_by("count")