from django.contrib import admin
from .models import Hospital, Service


class ServiceInline(admin.TabularInline):
    model  = Service
    extra  = 1   # affiche 1 ligne vide pour ajouter un service directement


@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display  = ('name', 'city', 'available_beds', 'total_beds', 'occupancy_rate', 'updated_at')
    list_filter   = ('city',)
    search_fields = ('name', 'city')
    inlines       = [ServiceInline]

    def occupancy_rate(self, obj):
        return f"{obj.occupancy_rate}%"
    occupancy_rate.short_description = "Taux d'occupation"


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display  = ('name', 'hospital', 'available', 'updated_at')
    list_filter   = ('available', 'hospital')
    search_fields = ('name',)
