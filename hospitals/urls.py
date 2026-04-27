from django.urls import path
from . import views

urlpatterns = [
    # Page HTML
    path('', views.home, name='home'),

    # Endpoints publics
    path('api/hospitals/', views.hospital_list, name='hospital-list'),
    path('api/hospitals/<int:pk>/', views.hospital_detail, name='hospital-detail'),
    path('api/stats/', views.stats, name='stats'),

    # Endpoints SMS
    path('api/envoyer-code/', views.envoyer_code, name='envoyer-code'),
    path('api/verifier-code/', views.verifier_code, name='verifier-code'),

    # Endpoints demandes inscription
    path('api/demandes/', views.liste_demandes, name='liste-demandes'),
    path('api/demandes/soumettre/', views.soumettre_demande, name='soumettre-demande'),
    path('api/demandes/<int:pk>/', views.traiter_demande, name='traiter-demande'),

    # Endpoints admin
    path('api/hospitals/<int:pk>/beds/', views.update_beds, name='update-beds'),
    path('api/services/<int:pk>/update/', views.update_service, name='update-service'),
]