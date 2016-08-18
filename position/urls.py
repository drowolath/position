import views
from django.conf.urls import url

urlpatterns = [
    url(
        r'(?P<latitude>[\d.@+-]+)/(?P<longitude>[\d.@+-]+)',
        views.mapit,
        name='mapit'),
    url(
        r'(?P<name>[\alphanum]+)',
        views.trackers,
        name='named_liveposition'),
    url(
        r'(?P<imei>\d{15})',
        views.trackers,
        name='liveposition'),
    url(
        r'^$',
        views.index,
        name='index'),
    ]
    
