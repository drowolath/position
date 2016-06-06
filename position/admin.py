import models
from django.contrib import admin


class DeviceAdmin(admin.ModelAdmin):
    search_fields = ['name', 'imei', 'phonenumber']
    list_display = ['name', 'imei', 'phonenumber', 'description']

admin.site.register(models.Device, DeviceAdmin)

                        
