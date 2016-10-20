# encoding: utf-8

import collections
import itertools
import json
import os
import requests
import time
from django import forms
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from models import Device
from reportlab.pdfgen import canvas


class SummaryForm(forms.Form):
    start = forms.DateTimeField(
        input_formats=[
            '%d/%m/%Y %H:%M:%S',
            ],
        required=True
        )
    stop = forms.DateTimeField(
        input_formats=[
            '%d/%m/%Y %H:%M:%S',
            ],
        required=False
        )


class HistoryForm(forms.Form):
    u"""Formulaire de recherche de traces"""
    imei = forms.CharField(required=True)
    start = forms.DateTimeField(
        input_formats=[
            '%d/%m/%Y %H:%M:%S',
            ],
        required=True
        )
    stop = forms.DateTimeField(
        input_formats=[
            '%d/%m/%Y %H:%M:%S',
            ],
        required=False
        )

    
def mapit(request, **kwargs):
    """vue qui affiche un point sur une carte"""
    context = kwargs
    return render(request, 'mapit.html', context)


@login_required
def index(request, template_name="index.html"):
    """vue d'accueil: elle propose à l'utilisateur
    connecté, la liste des trackers enregistrés ainsi
    qu'une carte sur laquelle elle affiche les positions
    live de ces trackers; sur demande elle propose un formulaire
    qui renvoie vers un tracé d'historique de trace"""
    context = {
        'page_title': 'Track it',
        'brand_name': 'GPS Tracking',
        'devices': Device.objects.all()
        }
    if request.method == 'POST':
        # on va rechercher l'historique d'un tracker
        form = HistoryForm(request.POST)
        if form.is_valid():
            imei = form.cleaned_data['imei']
            start = form.cleaned_data['start']
            stop = form.cleaned_data['stop']
            start = start.strftime('%d%m%Y%H%M%S')
            if not stop:
                stop = time.time().strftime('%d%m%Y%H%M%S')
            else:
                stop = stop.strftime('%d%m%Y%H%M%S')
            request.method = 'GET'
            result = trackers(request, imei=imei, start=start, stop=stop)
            if result.status_code == 200:
                tracks = result.content
                context['device'] = Device.objects.get(imei=imei)
                context['data'] = json.loads(tracks)
                context['tracks'] = tracks
                return render(request, 'history.html', context)
            else:
                return result
        else:
            form = SummaryForm(request.POST)
            response = HttpResponse(content_type='application/pdf')
            response['Content-Disposition'] = 'filename="distances.pdf"'
            if form.is_valid():
                start = form.cleaned_data['start']
                stop = form.cleaned_data['stop']
                start = start.strftime('%d%m%Y%H%M%S')
                if not stop:
                    stop = time.time().strftime('%d%m%Y%H%M%S')
                else:
                    stop = stop.strftime('%d%m%Y%H%M%S')
                bar = time.strptime(start, '%d%m%Y%H%M%S')
                start = time.strftime('%Y-%m-%d %H:%M:%S', bar)
                foo = time.strptime(stop, '%d%m%Y%H%M%S')
                stop = time.strftime('%Y-%m-%d %H:%M:%S', foo)
                devices = {i.imei: i.name for i in context['devices']}
                names = sorted(devices.values(), key=lambda x: x.split()[1])
                names = itertools.groupby(names, lambda x: x.split()[1])
                s_devices = collections.OrderedDict()
                for _, gnames in names:
                    gnames = sorted(gnames)
                    for gname in gnames:
                        for key, value in devices.items():
                            if value == gname:
                                s_devices[key] = value
                devices = s_devices
                p = canvas.Canvas(response)
                title = "Distances parcourues du {0} au {1}".format(
                    time.strftime('%d-%m-%Y %H:%M:%S', bar),
                    time.strftime('%d-%m-%Y %H:%M:%S', foo)
                    )
                p.drawString(100, 800, title)
                y = 760
                request.method = 'GET'
                for device in devices:
                    result = requests.get(
                        url=os.path.join(
                            settings.GPSTRACKER_API_URL,
                            'v1',
                            'distances',
                            device),
                        params={
                            'start': start,
                            'stop': stop
                            }
                        )
                    if result.status_code == 200:
                        distance = '{} km'.format(result.json()['distance'])
                    elif result.status_code == 204:
                        distance = '0 km'
                    else:
                        distance = ("Impossible de calculer "
                                    "la distance (HTTP {})").format(
                                        result.status_code)
                    p.drawString(100, y, '{0}: {1}'.format(
                        devices[device], distance))
                    y -= 20
                p.showPage()
                p.save()
                return response
    return render(request, 'index.html', context)


@login_required
def trackers(request, **kwargs):
    """vue d'accès aux informations sur les trackers"""
    if request.method == 'POST':
        return HttpResponse(status=405)
    elif not kwargs:
        devices = Device.objects.all()
        return JsonResponse(list(devices.values()), safe=False)
    else:
        session = requests.Session()
        device = get_object_or_404(Device, imei=kwargs['imei'])
        start = kwargs.get('start')
        if start:
            bar = time.strptime(start, '%d%m%Y%H%M%S')
            start = time.strftime('%Y-%m-%d %H:%M:%S', bar)
        stop = kwargs.get('stop')
        if stop:
            bar = time.strptime(stop, '%d%m%Y%H%M%S')
            stop = time.strftime('%Y-%m-%d %H:%M:%S', bar)
        req = requests.Request(
            method='GET',
            url=os.path.join(
                settings.GPSTRACKER_API_URL,
                'v1', 'positions', kwargs['imei']),
            params={
                'start': start,
                'stop': stop
                }
            )
        token = settings.TOKENS.get('django')  # en attendant de gérer mieux
        while True:
            req.auth = (token, '')
            api_response = session.send(req.prepare())
            if api_response.status_code == 200:
                # on a nos données en GeoJSON
                result = api_response.json()
                if result['type'] == 'Feature':
                    result['properties']['color'] = device.color
                return JsonResponse(result, safe=False)
            elif api_response.status_code == 401:
                # il faut s'authentifier d'abord
                auth_result = requests.post(
                    auth=('django', settings.GPSTRACKER_API['django']),
                    url=os.path.join(settings.GPSTRACKER_API_URL,
                                     'auth',
                                     'request-token'),
                    timeout=300
                    )
                if auth_result.status_code == 200:
                    token = auth_result.json()['token']
                    settings.TOKENS.set('django', token)
                    settings.TOKENS.expire('django', 3600)
                    # authentification OK
                else:
                    return HttpResponse(status=auth_result.status_code)
            else:
                return HttpResponse(status=api_response.status_code)
