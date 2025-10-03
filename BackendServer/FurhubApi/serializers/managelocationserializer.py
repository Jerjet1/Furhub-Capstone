from rest_framework import serializers
from ..models import Province, City, Barangay

class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ['province_id', 'province_name']

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = ['city_id', 'city_name', 'province']

class BarangaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Barangay
        fields = ['barangay_id', 'barangay_name', 'city']
