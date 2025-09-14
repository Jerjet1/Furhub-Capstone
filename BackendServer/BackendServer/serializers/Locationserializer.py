from rest_framework import serializers
from FurhubApi.models import Location , PetOwner



class LocationSerializer(serializers.ModelSerializer):
    address = serializers.SerializerMethodField()

    class Meta:
        model = Location
        fields = ["province", "city", "barangay", "street", "latitude", "longitude", "address"]

    def get_address(self, obj):
        return str(obj)  # calls __str__
class UpdateAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetOwner
        fields = ['address', 'latitude', 'longitude']