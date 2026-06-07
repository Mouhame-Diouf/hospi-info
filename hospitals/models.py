from django.db import models
import random


class Hospital(models.Model):
    name           = models.CharField(max_length=200)
    city           = models.CharField(max_length=100)
    address        = models.CharField(max_length=255, blank=True, default='')
    phone          = models.CharField(max_length=20, blank=True, default='')
    email          = models.EmailField(blank=True, default='')
    password       = models.CharField(max_length=200, blank=True, default='admin123')
    latitude       = models.FloatField(null=True, blank=True)
    longitude      = models.FloatField(null=True, blank=True)
    total_beds     = models.IntegerField(default=0)
    available_beds = models.IntegerField(default=0)
    updated_at     = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    @property
    def occupancy_rate(self):
        if self.total_beds == 0:
            return 0
        return round((self.total_beds - self.available_beds) / self.total_beds * 100, 1)

    class Meta:
        verbose_name = "Hôpital"
        verbose_name_plural = "Hôpitaux"


class Service(models.Model):
    # CE obligatoire : un service appartient forcément à un hôpital (1,1)
    hospital   = models.ForeignKey(
        Hospital,
        on_delete=models.CASCADE,
        related_name='services'
    )
    name       = models.CharField(max_length=100)
    available  = models.BooleanField(default=True)
    horaires   = models.CharField(max_length=100, blank=True, default='8h - 17h')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} — {self.hospital.name}"

    class Meta:
        verbose_name = "Service"
        verbose_name_plural = "Services"


class Medecin(models.Model):
    # CE obligatoire : un médecin appartient forcément à un hôpital (1,n)
    hospital      = models.ForeignKey(
        Hospital,
        on_delete=models.CASCADE,
        related_name='medecins'
    )
    # CE optionnel : un médecin peut être dans un service ou pas (0,1)
    service       = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        related_name='medecins',
        null=True,
        blank=True
    )
    nom           = models.CharField(max_length=200)
    specialite    = models.CharField(max_length=200)
    telephone     = models.CharField(max_length=20, blank=True, default='')
    disponible    = models.BooleanField(default=True)
    heure_debut   = models.TimeField(default='08:00')
    heure_fin     = models.TimeField(default='17:00')
    jours_travail = models.CharField(max_length=200, default='Lun-Ven')
    updated_at    = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nom} — {self.hospital.name}"

    class Meta:
        verbose_name = "Médecin"
        verbose_name_plural = "Médecins"


class Patient(models.Model):
    """
    Table Patient séparée — ajoutée sur recommandation encadreur
    Un patient est identifié par son téléphone (unique)
    """
    nom        = models.CharField(max_length=200)
    telephone  = models.CharField(max_length=20, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.nom} — {self.telephone}"

    class Meta:
        verbose_name = "Patient"
        verbose_name_plural = "Patients"
        ordering = ['-created_at']


class RendezVous(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirme', 'Confirmé'),
        ('annule', 'Annulé'),
        ('termine', 'Terminé'),
    ]

    # CE obligatoire vers Hospital (1,1)
    hospital = models.ForeignKey(
        Hospital,
        on_delete=models.CASCADE,
        related_name='rendezvous'
    )
    # CE optionnel vers Medecin (0,1) — un RDV concerne UN SEUL médecin
    medecin = models.ForeignKey(
        Medecin,
        on_delete=models.SET_NULL,
        related_name='rendezvous',
        null=True,
        blank=True
    )
    # CE optionnel vers Service (0,1)
    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        related_name='rendezvous',
        null=True,
        blank=True
    )
    # CE obligatoire vers Patient (table séparée)
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='rendezvous',
        null=True,
        blank=True
    )
    # Gardés pour compatibilité avec le frontend existant
    nom_patient = models.CharField(max_length=200, blank=True, default='')
    telephone   = models.CharField(max_length=20, blank=True, default='')

    motif      = models.TextField(blank=True, default='')
    date       = models.DateField()
    heure      = models.TimeField(default='08:00')
    statut     = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_attente'
    )
    numero_rdv = models.CharField(max_length=20, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Générer numéro RDV automatiquement
        if not self.numero_rdv:
            self.numero_rdv = f"RDV-{random.randint(100000, 999999)}"
        # Synchroniser patient avec nom_patient et telephone
        if self.patient:
            self.nom_patient = self.patient.nom
            self.telephone = self.patient.telephone
        # Créer patient automatiquement si nom et tel fournis
        elif self.nom_patient and self.telephone:
            patient, _ = Patient.objects.get_or_create(
                telephone=self.telephone,
                defaults={'nom': self.nom_patient}
            )
            self.patient = patient
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.numero_rdv} — {self.nom_patient}"

    class Meta:
        verbose_name = "Rendez-vous"
        verbose_name_plural = "Rendez-vous"
        ordering = ['-created_at']


class DemandeInscription(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('approuve', 'Approuvé'),
        ('rejete', 'Rejeté'),
    ]

    nom        = models.CharField(max_length=200)
    ville      = models.CharField(max_length=100)
    adresse    = models.CharField(max_length=255, blank=True, default='')
    telephone  = models.CharField(max_length=20, blank=True, default='')
    email      = models.EmailField()
    total_lits = models.IntegerField(default=0)
    services   = models.JSONField(default=list)
    responsable = models.CharField(max_length=200, blank=True, default='')
    motdepasse = models.CharField(max_length=200, blank=True, default='')
    # GPS automatique ajouté
    latitude   = models.FloatField(null=True, blank=True)
    longitude  = models.FloatField(null=True, blank=True)
    statut     = models.CharField(
        max_length=20,
        choices=STATUT_CHOICES,
        default='en_attente'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} — {self.statut}"

    class Meta:
        verbose_name = "Demande d'inscription"
        verbose_name_plural = "Demandes d'inscription"
        ordering = ['-created_at']