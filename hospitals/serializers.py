from rest_framework import serializers
from .models import Hospital, Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Service
        fields = ['id', 'name', 'available', 'updated_at']


class HospitalSerializer(serializers.ModelSerializer):
    services       = ServiceSerializer(many=True, read_only=True)
    occupancy_rate = serializers.ReadOnlyField()

    class Meta:
        model  = Hospital
        fields = [
    'id', 'name', 'city', 'address', 'phone', 'email','password',
    'latitude', 'longitude',
    'total_beds', 'available_beds', 'occupancy_rate',
    'services', 'updated_at',
]


class HospitalUpdateBedsSerializer(serializers.ModelSerializer):
    """Utilisé uniquement pour la mise à jour des lits disponibles."""
    class Meta:
        model  = Hospital
        fields = ['available_beds']

    def validate_available_beds(self, value):
        if value < 0:
            raise serializers.ValidationError(
                "Le nombre de lits ne peut pas être négatif."
            )
        if self.instance and value > self.instance.total_beds:
            raise serializers.ValidationError(
                f"Impossible : dépasse la capacité totale ({self.instance.total_beds} lits)."
            )
        return value


class ServiceUpdateSerializer(serializers.ModelSerializer):
    """Utilisé pour activer ou désactiver un service."""
    class Meta:
        model  = Service
        fields = ['available']
