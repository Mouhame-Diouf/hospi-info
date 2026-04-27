import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from hospitals.models import Hospital, Service

# Supprimer les anciennes données
Hospital.objects.all().delete()

# Créer les vrais hôpitaux de Dakar
hopitaux = [
    {
        'name': 'Hôpital Principal de Dakar',
        'city': 'Dakar',
        'address': 'Avenue Nelson Mandela, Dakar',
        'phone': '+221 33 839 50 00',
        'latitude': 14.6937,
        'longitude': -17.4441,
        'total_beds': 500,
        'available_beds': 120,
        'services': ['Urgences', 'Maternité', 'Pédiatrie', 'Chirurgie', 'Cardiologie']
    },
    {
        'name': 'Hôpital Aristide Le Dantec',
        'city': 'Dakar',
        'address': 'Avenue Pasteur, Dakar',
        'phone': '+221 33 839 10 00',
        'latitude': 14.6715,
        'longitude': -17.4390,
        'total_beds': 350,
        'available_beds': 45,
        'services': ['Urgences', 'Neurologie', 'Dermatologie', 'Chirurgie']
    },
    {
        'name': 'Hôpital de Fann',
        'city': 'Dakar',
        'address': 'Avenue Cheikh Anta Diop, Dakar',
        'phone': '+221 33 869 18 18',
        'latitude': 14.6928,
        'longitude': -17.4607,
        'total_beds': 300,
        'available_beds': 80,
        'services': ['Neurologie', 'Psychiatrie', 'Médecine Interne']
    },
    {
        'name': 'Hôpital Général de Grand Yoff',
        'city': 'Dakar',
        'address': 'Grand Yoff, Dakar',
        'phone': '+221 33 867 19 19',
        'latitude': 14.7367,
        'longitude': -17.4560,
        'total_beds': 250,
        'available_beds': 0,
        'services': ['Urgences', 'Maternité', 'Pédiatrie', 'Chirurgie']
    },
    {
        'name': 'Hôpital Idrissa Pouye',
        'city': 'Dakar',
        'address': 'Grand Yoff, Dakar',
        'phone': '+221 33 867 25 25',
        'latitude': 14.7280,
        'longitude': -17.4490,
        'total_beds': 200,
        'available_beds': 35,
        'services': ['Urgences', 'Maternité', 'Pédiatrie']
    },
]

for h in hopitaux:
    hospital = Hospital.objects.create(
        name=h['name'],
        city=h['city'],
        address=h['address'],
        phone=h['phone'],
        latitude=h['latitude'],
        longitude=h['longitude'],
        total_beds=h['total_beds'],
        available_beds=h['available_beds'],
    )
    for service in h['services']:
        Service.objects.create(
            hospital=hospital,
            name=service,
            available=True
        )
    print(f"✅ {hospital.name} ajouté !")

print("\n🎉 Tous les hôpitaux ont été ajoutés avec succès !")