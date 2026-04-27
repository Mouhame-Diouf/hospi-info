from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
import random

from .models import Hospital, Service, DemandeInscription
from .serializers import (
    HospitalSerializer,
    HospitalUpdateBedsSerializer,
    ServiceUpdateSerializer,
)
from .sms import envoyer_code_sms

# Stockage temporaire des codes
codes_temporaires = {}

# ─────────────────────────────────────────────
#  PAGE HTML
# ─────────────────────────────────────────────

def home(request):
    hospitals = Hospital.objects.all()
    return render(request, 'hospitals/index.html', {'hospitals': hospitals})


# ─────────────────────────────────────────────
#  ENDPOINTS PUBLICS
# ─────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def hospital_list(request):
    hospitals = Hospital.objects.all().order_by('-available_beds')
    city = request.query_params.get('city')
    if city:
        hospitals = hospitals.filter(city__icontains=city)
    available = request.query_params.get('available')
    if available and available.lower() == 'true':
        hospitals = hospitals.filter(available_beds__gt=0)
    serializer = HospitalSerializer(hospitals, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def hospital_detail(request, pk):
    try:
        hospital = Hospital.objects.get(pk=pk)
    except Hospital.DoesNotExist:
        return Response({'error': 'Hôpital introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = HospitalSerializer(hospital)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def stats(request):
    total_hospitals = Hospital.objects.count()
    total_beds = sum(h.total_beds for h in Hospital.objects.all())
    available_beds = sum(h.available_beds for h in Hospital.objects.all())
    full_hospitals = Hospital.objects.filter(available_beds=0).count()
    return Response({
        'total_hospitals': total_hospitals,
        'total_beds': total_beds,
        'available_beds': available_beds,
        'full_hospitals': full_hospitals,
        'occupancy_rate': round((total_beds - available_beds) / total_beds * 100, 1) if total_beds else 0,
    })


# ─────────────────────────────────────────────
#  ENDPOINTS SMS
# ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def envoyer_code(request):
    telephone = request.data.get('telephone')
    if not telephone:
        return Response({'error': 'Numéro requis.'}, status=status.HTTP_400_BAD_REQUEST)
    code = str(random.randint(1000, 9999))
    codes_temporaires[telephone] = code
    succes = envoyer_code_sms(telephone, code)
    if succes:
        return Response({'message': f'Code envoyé au {telephone}'})
    else:
        return Response({'error': 'Erreur SMS.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def verifier_code(request):
    telephone = request.data.get('telephone')
    code = request.data.get('code')
    if not telephone or not code:
        return Response({'error': 'Téléphone et code requis.'}, status=status.HTTP_400_BAD_REQUEST)
    code_attendu = codes_temporaires.get(telephone)
    if code_attendu and code == code_attendu:
        del codes_temporaires[telephone]
        return Response({'message': 'Code correct !', 'valide': True})
    else:
        return Response({'error': 'Code incorrect.', 'valide': False}, status=status.HTTP_400_BAD_REQUEST)


# ─────────────────────────────────────────────
#  ENDPOINTS DEMANDES INSCRIPTION
# ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def soumettre_demande(request):
    """
    POST /api/demandes/
    Soumettre une demande d'inscription d'hôpital
    """
    data = request.data
    try:
        demande = DemandeInscription.objects.create(
            nom=data.get('nom'),
            ville=data.get('ville'),
            adresse=data.get('adresse'),
            telephone=data.get('telephone'),
            email=data.get('email'),
            total_lits=data.get('totalLits', 0),
            services=data.get('services', []),
            responsable=data.get('responsable'),
        )
        return Response({
            'message': 'Demande soumise avec succès !',
            'id': demande.id
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def liste_demandes(request):
    """
    GET /api/demandes/
    Liste toutes les demandes d'inscription
    """
    demandes = DemandeInscription.objects.all()
    data = [{
        'id': d.id,
        'nom': d.nom,
        'ville': d.ville,
        'adresse': d.adresse,
        'telephone': d.telephone,
        'email': d.email,
        'totalLits': d.total_lits,
        'services': d.services,
        'responsable': d.responsable,
        'statut': d.statut,
        'created_at': d.created_at,
    } for d in demandes]
    return Response(data)


@api_view(['PATCH'])
@permission_classes([AllowAny])
def traiter_demande(request, pk):
    """
    PATCH /api/demandes/<id>/
    Approuver ou rejeter une demande
    """
    try:
        demande = DemandeInscription.objects.get(pk=pk)
    except DemandeInscription.DoesNotExist:
        return Response({'error': 'Demande introuvable.'}, status=status.HTTP_404_NOT_FOUND)

    nouveau_statut = request.data.get('statut')

    if nouveau_statut == 'approuve':
        demande.statut = 'approuve'
        demande.save()
        # Créer automatiquement l'hôpital dans la base de données
        hospital = Hospital.objects.create(
            name=demande.nom,
            city=demande.ville,
            address=demande.adresse,
            phone=demande.telephone,
            total_beds=demande.total_lits,
            available_beds=demande.total_lits,
        )
        for service in demande.services:
            Service.objects.create(hospital=hospital, name=service, available=True)
        return Response({'message': f'{demande.nom} approuvé et ajouté à HOSPI-INFO !'})

    elif nouveau_statut == 'rejete':
        demande.statut = 'rejete'
        demande.save()
        return Response({'message': f'{demande.nom} rejeté.'})

    return Response({'error': 'Statut invalide.'}, status=status.HTTP_400_BAD_REQUEST)


# ─────────────────────────────────────────────
#  ENDPOINTS ADMIN
# ─────────────────────────────────────────────

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_beds(request, pk):
    try:
        hospital = Hospital.objects.get(pk=pk)
    except Hospital.DoesNotExist:
        return Response({'error': 'Hôpital introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = HospitalUpdateBedsSerializer(hospital, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Disponibilité mise à jour.',
            'available_beds': serializer.instance.available_beds,
            'total_beds': hospital.total_beds,
            'occupancy_rate': hospital.occupancy_rate,
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_service(request, pk):
    try:
        service = Service.objects.get(pk=pk)
    except Service.DoesNotExist:
        return Response({'error': 'Service introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ServiceUpdateSerializer(service, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': f"Service '{service.name}' mis à jour.",
            'available': service.available,
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)