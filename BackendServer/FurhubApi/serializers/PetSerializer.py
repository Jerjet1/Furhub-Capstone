from rest_framework import serializers
from FurhubApi.models import Pet, Pet_Form

class PetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Pet
        fields = ['pet_id','owner', 'name', 'breed', 'age', 'size', 'is_active']

class PetFormSerializer(serializers.ModelSerializer):
    pet = PetSerializer(read_only=True)

    class Meta:
        model = Pet_Form
        fields = ['pet', 'welfare_note']