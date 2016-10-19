from django.db import models
from django import forms


class Device(models.Model):
    imei = models.CharField(max_length=15, unique=True, primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    phonenumber = models.CharField(max_length=20, unique=True)
    color = models.CharField(max_length=6, unique=True)
    description = models.TextField(max_length=100)
    
    class Meta:
        ordering = ['imei']
        verbose_name = 'Module GPS'
        verbose_name_plural = 'Modules GPS'
        
    def __unicode__(self):
        return self.name


class SummaryForm(forms.Form):
    start = forms.DateTimeField(
        input_formats= [
            '%d/%m/%Y %H:%M:%S',
            ],
        required=True
        )
    stop = forms.DateTimeField(
        input_formats= [
            '%d/%m/%Y %H:%M:%S',
            ],
        required=False
        )

    
class HistoryForm(forms.Form):
    u"""Formulaire de recherche de traces"""
    imei = forms.CharField(required=True)
    start = forms.DateTimeField(
        input_formats= [
            '%d/%m/%Y %H:%M:%S',
            ],
        required=True
        )
    stop = forms.DateTimeField(
        input_formats= [
            '%d/%m/%Y %H:%M:%S',
            ],
        required=False
        )
