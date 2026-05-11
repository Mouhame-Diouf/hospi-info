from django.db import models


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


class Service(models.Model):
    hospital   = models.ForeignKey(Hospital, on_delete=models.CASCADE,
                                   related_name='services')
    name       = models.CharField(max_length=100)
    available  = models.BooleanField(default=True)
    horaires   = models.CharField(max_length=100, blank=True, default='8h - 17h')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} — {self.hospital.name}"


class Medecin(models.Model):
    hospital      = models.ForeignKey(Hospital, on_delete=models.CASCADE,
                                      related_name='medecins')
    service       = models.ForeignKey(Service, on_delete=models.CASCADE,
                                      related_name='medecins', null=True, blank=True)
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


class RendezVous(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('confirme', 'Confirmé'),
        ('annule', 'Annulé'),
        ('termine', 'Terminé'),
    ]

    hospital    = models.ForeignKey(Hospital, on_delete=models.CASCADE,
                                    related_name='rendezvous')
    medecin     = models.ForeignKey(Medecin, on_delete=models.CASCADE,
                                    related_name='rendezvous', null=True, blank=True)
    service     = models.ForeignKey(Service, on_delete=models.CASCADE,
                                    related_name='rendezvous', null=True, blank=True)
    nom_patient = models.CharField(max_length=200)
    telephone   = models.CharField(max_length=20)
    motif       = models.TextField(blank=True, default='')
    date        = models.DateField()
    heure       = models.TimeField()
    statut      = models.CharField(max_length=20, choices=STATUT_CHOICES,
                                   default='en_attente')
    numero_rdv  = models.CharField(max_length=20, unique=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.numero_rdv:
            import random
            self.numero_rdv = f"RDV-{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.numero_rdv} — {self.nom_patient}"


class DemandeInscription(models.Model):
    STATUT_CHOICES = [
        ('en_attente', 'En attente'),
        ('approuve', 'Approuvé'),
        ('rejete', 'Rejeté'),
    ]

    nom          = models.CharField(max_length=200)
    ville        = models.CharField(max_length=100)
    adresse      = models.CharField(max_length=255)
    telephone    = models.CharField(max_length=20)
    email        = models.EmailField()
    total_lits   = models.IntegerField(default=0)
    services     = models.JSONField(default=list)
    responsable  = models.CharField(max_length=200)
    statut       = models.CharField(max_length=20, choices=STATUT_CHOICES,
                                    default='en_attente')
    created_at   = models.DateTimeField(auto_now_add=True)
    motdepasse = models.CharField(max_length=200, blank=True, default='')

    def __str__(self):
        return f"{self.nom} — {self.statut}"

    class Meta:
        ordering = ['-created_at']