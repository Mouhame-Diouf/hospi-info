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
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} — {self.hospital.name}"


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
    statut       = models.CharField(max_length=20, choices=STATUT_CHOICES, default='en_attente')
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nom} — {self.statut}"

    class Meta:
        ordering = ['-created_at']