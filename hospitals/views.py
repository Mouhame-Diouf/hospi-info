from django.shortcuts import render
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
import random

from .models import Hospital, Service, DemandeInscription, Medecin, RendezVous
from .serializers import (
    HospitalSerializer,
    HospitalUpdateBedsSerializer,
    ServiceUpdateSerializer,
)
from .sms import envoyer_code_sms

codes_temporaires = {}

def home(request):
    hospitals = Hospital.objects.all()
    return render(request, 'hospitals/index.html', {'hospitals': hospitals})

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
#  ENDPOINTS MÉDECINS
# ─────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def medecin_list(request, hospital_pk):
    medecins = Medecin.objects.filter(hospital_id=hospital_pk)
    service = request.query_params.get('service')
    if service:
        medecins = medecins.filter(service__name__icontains=service)
    data = [{
        'id': m.id, 'nom': m.nom, 'specialite': m.specialite,
        'telephone': m.telephone, 'disponible': m.disponible,
        'heure_debut': str(m.heure_debut), 'heure_fin': str(m.heure_fin),
        'jours_travail': m.jours_travail,
        'service': m.service.name if m.service else None,
    } for m in medecins]
    return Response(data)

@api_view(['POST'])
@permission_classes([AllowAny])
def medecin_create(request, hospital_pk):
    try:
        hospital = Hospital.objects.get(pk=hospital_pk)
        service = None
        if request.data.get('service_id'):
            service = Service.objects.get(pk=request.data.get('service_id'))
        medecin = Medecin.objects.create(
            hospital=hospital, service=service,
            nom=request.data.get('nom'),
            specialite=request.data.get('specialite'),
            telephone=request.data.get('telephone', ''),
            disponible=request.data.get('disponible', True),
            heure_debut=request.data.get('heure_debut', '08:00'),
            heure_fin=request.data.get('heure_fin', '17:00'),
            jours_travail=request.data.get('jours_travail', 'Lun-Ven'),
        )
        return Response({'message': 'Médecin ajouté !', 'id': medecin.id},
                        status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([AllowAny])
def medecin_update(request, pk):
    try:
        medecin = Medecin.objects.get(pk=pk)
        for field in ['nom', 'specialite', 'telephone', 'disponible',
                      'heure_debut', 'heure_fin', 'jours_travail']:
            if field in request.data:
                setattr(medecin, field, request.data[field])
        medecin.save()
        return Response({'message': 'Médecin mis à jour !'})
    except Medecin.DoesNotExist:
        return Response({'error': 'Médecin introuvable.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def medecin_delete(request, pk):
    try:
        medecin = Medecin.objects.get(pk=pk)
        medecin.delete()
        return Response({'message': 'Médecin supprimé !'})
    except Medecin.DoesNotExist:
        return Response({'error': 'Médecin introuvable.'}, status=status.HTTP_404_NOT_FOUND)

# ─────────────────────────────────────────────
#  ENDPOINTS RENDEZ-VOUS
# ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def creer_rendezvous(request):
    try:
        hospital = Hospital.objects.get(pk=request.data.get('hospital_id'))
        medecin = None
        service = None
        if request.data.get('medecin_id'):
            try:
                medecin = Medecin.objects.get(pk=request.data.get('medecin_id'))
            except:
                pass
        if request.data.get('service_id'):
            try:
                service = Service.objects.get(pk=request.data.get('service_id'))
            except:
                pass

        rdv = RendezVous.objects.create(
            hospital=hospital,
            medecin=medecin,
            service=service,
            nom_patient=request.data.get('nom_patient', ''),
            telephone=request.data.get('telephone', ''),
            motif=request.data.get('motif', ''),
            date=request.data.get('date'),
            heure=request.data.get('heure', '08:00:00'),
        )

        # ─── NOTIFICATION EMAIL ───
        try:
            sujet = f"🏥 Nouvelle demande RDV — {rdv.numero_rdv}"
            message = f"""
Bonjour,

Une nouvelle demande de rendez-vous a été reçue sur HOSPI-INFO !

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Numéro RDV : {rdv.numero_rdv}
👤 Patient    : {rdv.nom_patient}
📞 Téléphone  : {rdv.telephone}
🏥 Hôpital    : {hospital.name}
📅 Date souhaitée : {rdv.date}
📝 Motif      : {rdv.motif}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Connectez-vous sur votre dashboard pour confirmer :
👉 https://hospi-info.vercel.app/login-hopital

— L'équipe HOSPI-INFO
            """

            destinataires = [settings.ADMIN_EMAIL]
            if hospital.email:
                destinataires.append(hospital.email)

            send_mail(
                sujet,
                message,
                settings.DEFAULT_FROM_EMAIL,
                destinataires,
                fail_silently=True
            )
            print(f"✅ Email envoyé pour RDV {rdv.numero_rdv}")
        except Exception as e:
            print(f"❌ Erreur email : {e}")

        return Response({
            'message': 'Rendez-vous créé !',
            'numero_rdv': rdv.numero_rdv,
            'id': rdv.id
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def liste_rendezvous(request, hospital_pk):
    rdvs = RendezVous.objects.filter(hospital_id=hospital_pk).order_by('-created_at')
    data = [{
        'id': r.id, 'numero_rdv': r.numero_rdv,
        'nom_patient': r.nom_patient, 'telephone': r.telephone,
        'motif': r.motif, 'date': str(r.date), 'heure': str(r.heure),
        'statut': r.statut,
        'medecin': r.medecin.nom if r.medecin else None,
        'service': r.service.name if r.service else None,
        'created_at': r.created_at,
    } for r in rdvs]
    return Response(data)

@api_view(['PATCH'])
@permission_classes([AllowAny])
def update_rendezvous(request, pk):
    try:
        rdv = RendezVous.objects.get(pk=pk)
        if 'statut' in request.data:
            rdv.statut = request.data['statut']
        rdv.save()

        # Email au patient quand confirmé ou annulé
        try:
            if rdv.statut in ['confirme', 'annule']:
                sujet = f"HOSPI-INFO — Votre RDV {rdv.numero_rdv} a été {'confirmé' if rdv.statut == 'confirme' else 'annulé'}"
                message = f"""
Bonjour {rdv.nom_patient},

Votre demande de rendez-vous {rdv.numero_rdv} a été {'✅ CONFIRMÉE' if rdv.statut == 'confirme' else '❌ ANNULÉE'}.

🏥 Hôpital : {rdv.hospital.name}
📅 Date : {rdv.date}
{'👨‍⚕️ Médecin : ' + rdv.medecin.nom if rdv.medecin else ''}

{'Présentez-vous à l\'hôpital à l\'heure convenue.' if rdv.statut == 'confirme' else 'Veuillez contacter l\'hôpital pour plus d\'informations.'}

📞 Contact hôpital : {rdv.hospital.phone or 'Non disponible'}

— L\'équipe HOSPI-INFO
                """
                send_mail(sujet, message, settings.DEFAULT_FROM_EMAIL,
                         [settings.ADMIN_EMAIL], fail_silently=True)
        except Exception as e:
            print(f"Erreur email confirmation : {e}")

        return Response({'message': 'Rendez-vous mis à jour !'})
    except RendezVous.DoesNotExist:
        return Response({'error': 'Rendez-vous introuvable.'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def rechercher_rendezvous(request):
    telephone = request.query_params.get('telephone')
    if not telephone:
        return Response({'error': 'Téléphone requis.'}, status=status.HTTP_400_BAD_REQUEST)
    rdvs = RendezVous.objects.filter(telephone=telephone).order_by('-created_at')
    data = [{
        'id': r.id, 'numero_rdv': r.numero_rdv,
        'nom_patient': r.nom_patient, 'date': str(r.date),
        'heure': str(r.heure), 'statut': r.statut,
        'hospital': r.hospital.name,
        'medecin': r.medecin.nom if r.medecin else None,
        'service': r.service.name if r.service else None,
    } for r in rdvs]
    return Response(data)

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
    data = request.data
    try:
        demande = DemandeInscription.objects.create(
            nom=data.get('nom'), ville=data.get('ville'),
            adresse=data.get('adresse'), telephone=data.get('telephone'),
            email=data.get('email'), total_lits=data.get('totalLits', 0),
            services=data.get('services', []), responsable=data.get('responsable'),
        )

        # Email notification nouvelle demande
        try:
            send_mail(
                f"🏥 Nouvelle inscription hôpital — {demande.nom}",
                f"Nouvelle demande d'inscription :\n\nHôpital : {demande.nom}\nVille : {demande.ville}\nResponsable : {demande.responsable}\nEmail : {demande.email}\nTéléphone : {demande.telephone}\n\nConnectez-vous sur le Super Admin pour approuver.",
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
                fail_silently=True
            )
        except:
            pass

        return Response({'message': 'Demande soumise !', 'id': demande.id},
                        status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def liste_demandes(request):
    demandes = DemandeInscription.objects.all()
    data = [{
        'id': d.id, 'nom': d.nom, 'ville': d.ville,
        'adresse': d.adresse, 'telephone': d.telephone,
        'email': d.email, 'totalLits': d.total_lits,
        'services': d.services, 'responsable': d.responsable,
        'statut': d.statut, 'created_at': d.created_at,
    } for d in demandes]
    return Response(data)

@api_view(['PATCH'])
@permission_classes([AllowAny])
def traiter_demande(request, pk):
    try:
        demande = DemandeInscription.objects.get(pk=pk)
    except DemandeInscription.DoesNotExist:
        return Response({'error': 'Demande introuvable.'}, status=status.HTTP_404_NOT_FOUND)
    nouveau_statut = request.data.get('statut')
    if nouveau_statut == 'approuve':
        demande.statut = 'approuve'
        demande.save()
        hospital = Hospital.objects.create(
            name=demande.nom, city=demande.ville,
            address=demande.adresse, phone=demande.telephone,
            email=demande.email,
            total_beds=demande.total_lits, available_beds=demande.total_lits,
        )
        for service in demande.services:
            Service.objects.create(hospital=hospital, name=service, available=True)
        # Email à l'hôpital approuvé
        try:
            send_mail(
                "🎉 Votre hôpital a été approuvé sur HOSPI-INFO !",
                f"Bonjour {demande.responsable},\n\nVotre hôpital '{demande.nom}' a été approuvé et ajouté sur HOSPI-INFO !\n\nConnectez-vous maintenant :\n👉 https://hospi-info.vercel.app/login-hopital\n\nEmail : {demande.email}\n\n— L'équipe HOSPI-INFO",
                settings.DEFAULT_FROM_EMAIL,
                [demande.email],
                fail_silently=True
            )
        except:
            pass
        return Response({'message': f'{demande.nom} approuvé !'})
    elif nouveau_statut == 'rejete':
        demande.statut = 'rejete'
        demande.save()
        return Response({'message': f'{demande.nom} rejeté.'})
    return Response({'error': 'Statut invalide.'}, status=status.HTTP_400_BAD_REQUEST)

# ─────────────────────────────────────────────
#  ENDPOINTS ADMIN
# ─────────────────────────────────────────────

@api_view(['PATCH'])
@permission_classes([AllowAny])
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
@permission_classes([AllowAny])
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