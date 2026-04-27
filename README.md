# HOSPI-INFO — Backend Django

Application web de gestion en temps réel de la disponibilité hospitalière.

---

## Installation

```bash
# 1. Installer les dépendances
pip install django djangorestframework django-cors-headers

# 2. Appliquer les migrations (après avoir modifié models.py)
python manage.py makemigrations
python manage.py migrate

# 3. Créer un compte admin
python manage.py createsuperuser

# 4. Lancer le serveur
python manage.py runserver
```

---

## Endpoints API

### Publics (citoyens / ambulanciers)

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/hospitals/` | Liste tous les hôpitaux |
| GET | `/api/hospitals/?city=Dakar` | Filtrer par ville |
| GET | `/api/hospitals/?available=true` | Hôpitaux avec lits disponibles |
| GET | `/api/hospitals/<id>/` | Détail d'un hôpital + ses services |
| GET | `/api/stats/` | Statistiques globales |

### Admin (authentification requise)

| Méthode | URL | Description |
|---------|-----|-------------|
| PATCH | `/api/hospitals/<id>/beds/` | Mettre à jour les lits disponibles |
| PATCH | `/api/services/<id>/update/` | Activer / désactiver un service |

---

## Exemples de réponses

### GET /api/hospitals/
```json
[
  {
    "id": 1,
    "name": "Hôpital Principal de Dakar",
    "city": "Dakar",
    "address": "Avenue Cheikh Anta Diop",
    "phone": "+221 33 839 50 00",
    "latitude": 14.6928,
    "longitude": -17.4467,
    "total_beds": 200,
    "available_beds": 45,
    "occupancy_rate": 77.5,
    "services": [
      { "id": 1, "name": "Urgences", "available": true },
      { "id": 2, "name": "Maternité", "available": true },
      { "id": 3, "name": "Pédiatrie", "available": false }
    ],
    "updated_at": "2025-03-29T10:30:00Z"
  }
]
```

### PATCH /api/hospitals/1/beds/
```json
// Corps de la requête
{ "available_beds": 38 }

// Réponse
{
  "message": "Disponibilité mise à jour.",
  "available_beds": 38,
  "total_beds": 200,
  "occupancy_rate": 81.0
}
```

---

## Structure du projet

```
hospi-info/
├── manage.py
├── backend/
│   ├── settings.py     ← CORS + rest_framework configurés
│   ├── urls.py
│   └── wsgi.py
└── hospitals/
    ├── models.py        ← Hospital + Service (avec GPS)
    ├── serializers.py   ← Sérialisation + validation
    ├── views.py         ← Tous les endpoints
    ├── urls.py          ← Routes de l'API
    └── admin.py         ← Interface admin Django améliorée
```
