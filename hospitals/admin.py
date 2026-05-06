from django.contrib import admin
from .models import Hospital, Service, Medecin, RendezVous, DemandeInscription

@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ['name', 'city', 'available_beds', 'total_beds', 'occupancy_rate']
    search_fields = ['name', 'city']

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'hospital', 'available']
    list_filter = ['available', 'hospital']

@admin.register(Medecin)
class MedecinAdmin(admin.ModelAdmin):
    list_display = ['nom', 'specialite', 'hospital', 'service', 'disponible', 'heure_debut', 'heure_fin']
    list_filter = ['disponible', 'hospital']
    search_fields = ['nom', 'specialite']

@admin.register(RendezVous)
class RendezVousAdmin(admin.ModelAdmin):
    list_display = ['numero_rdv', 'nom_patient', 'hospital', 'medecin', 'date', 'heure', 'statut']
    list_filter = ['statut', 'hospital']
    search_fields = ['numero_rdv', 'nom_patient', 'telephone']

@admin.register(DemandeInscription)
class DemandeAdmin(admin.ModelAdmin):
    list_display = ['nom', 'ville', 'statut', 'created_at']
    list_filter = ['statut']