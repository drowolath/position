import views
from django.conf.urls import url

urlpatterns = [
    url(
        r'(?P<longitude>[\d.@+-]+)/(?P<latitude>[\d.@+-]+)',
        views.mapit,
        name='mapit'),
    url(
        r'^$',
        views.index,
        name='index'),
    ]
    
