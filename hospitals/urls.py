from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),

    # Hôpitaux
    path('api/hospitals/', views.hospital_list, name='hospital-list'),
    path('api/hospitals/<int:pk>/', views.hospital_detail, name='hospital-detail'),
    path('api/stats/', views.stats, name='stats'),

    # Médecins
    path('api/hospitals/<int:hospital_pk>/medecins/', views.medecin_list, name='medecin-list'),
    path('api/hospitals/<int:hospital_pk>/medecins/create/', views.medecin_create, name='medecin-create'),
    path('api/medecins/<int:pk>/', views.medecin_update, name='medecin-update'),
    path('api/medecins/<int:pk>/delete/', views.medecin_delete, name='medecin-delete'),
    
    path('api/hospitals/<int:hospital_pk>/services/', views.creer_service, name='creer-service'),

    # Rendez-vous
    path('api/rendezvous/', views.creer_rendezvous, name='creer-rendezvous'),
    path('api/rendezvous/rechercher/', views.rechercher_rendezvous, name='rechercher-rendezvous'),
    path('api/hospitals/<int:hospital_pk>/rendezvous/', views.liste_rendezvous, name='liste-rendezvous'),
    path('api/rendezvous/<int:pk>/', views.update_rendezvous, name='update-rendezvous'),

    # SMS
    path('api/envoyer-code/', views.envoyer_code, name='envoyer-code'),
    path('api/verifier-code/', views.verifier_code, name='verifier-code'),

    # Demandes inscription
    path('api/demandes/', views.liste_demandes, name='liste-demandes'),
    path('api/demandes/soumettre/', views.soumettre_demande, name='soumettre-demande'),
    path('api/demandes/<int:pk>/', views.traiter_demande, name='traiter-demande'),

    # Admin
    path('api/hospitals/<int:pk>/beds/', views.update_beds, name='update-beds'),
    path('api/services/<int:pk>/update/', views.update_service, name='update-service'),
]