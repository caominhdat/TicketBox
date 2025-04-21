from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models import CharField
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    avatar = CloudinaryField('avatar', null=True)


class BaseModel(models.Model):
    created_date = models.DateField(auto_now_add=True, null=True)
    updated_date = models.DateField(auto_now=True, null=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True  # lop truu tuong khong tao instance


class Category(BaseModel):
    name = models.CharField(max_length=50, null=False)
    image = models.ImageField(upload_to='category/%Y/%m', null=True)

    def __str__(self):
        return self.name


class Event(BaseModel):
    name = models.CharField(max_length=100, null=False)
    description = RichTextField()
    image = models.ImageField(upload_to='event/%Y/%m', null=True)
    address = models.CharField(max_length=100, null=True)
    map = models.CharField(max_length=100, null=True)
    category = models.ForeignKey(Category, on_delete=models.RESTRICT, null=True, related_name='events')  # Category xoa thi event xoa
    organizer = models.ForeignKey(User, on_delete=models.PROTECT, null=True)

    def __str__(self):
        return self.name

    class Meta:
        unique_together = ('name', 'category')


class TypeTicket(BaseModel):
    name = models.CharField(max_length=100, null=False)
    quantity = models.PositiveIntegerField()
    price = models.BigIntegerField()
    event = models.ForeignKey(Event, on_delete=models.CASCADE)  # Event xoa thi TypeTicket xoa

    def __str__(self):
        return self.name


class Discount(BaseModel):
    name = models.CharField(max_length=50, null=False)
    code = models.CharField(max_length=50, null=False)
    percent = models.IntegerField()
    max_use = models.IntegerField()

    def __str__(self):
        return self.name


class Payment(BaseModel):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    event = models.ForeignKey(Event, on_delete=models.PROTECT)
    type_ticket = models.ForeignKey(TypeTicket, on_delete=models.PROTECT)
    status = models.BooleanField(default=False)
    discount = models.ForeignKey(Discount, on_delete=models.CASCADE)

    def __str__(self):
        return self.status


class Ticket(BaseModel):
    qr_code = models.CharField(max_length=200, null=False)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    event = models.ForeignKey(Event, on_delete=models.PROTECT)
    type_ticket = models.ForeignKey(TypeTicket, on_delete=models.PROTECT)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE)

    def __str__(self):
        return self.qr_code


class CheckIn(BaseModel):
    ticket = models.ForeignKey(Ticket, models.CASCADE)
    event = models.ForeignKey(Event, models.CASCADE)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.status


class Review(BaseModel):
    rating = models.IntegerField(default=5)
    comment = RichTextField()
    user = models.ForeignKey(User, models.CASCADE)
    event = models.ForeignKey(Event, models.CASCADE)

    def __str__(self):
        return self.rating


class Notification(BaseModel):
    title = models.CharField(max_length=100, null=False)
    message = models.TextField()
    user = models.ForeignKey(User, models.PROTECT)
    event = models.ForeignKey(Event, models.PROTECT)

    def __str__(self):
        return self.title


class Chat(BaseModel):
    message = models.TextField()
    user = models.ForeignKey(User, models.CASCADE)

    def __str__(self):
        return self.message