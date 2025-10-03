from rest_framework import serializers
from FurhubApi.models import Users, PetWalker, PetBoarding, Service, PetOwner

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_no']

class PetOwnerUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetOwner
        fields = ['emergency_no', 'bio']

class PetBoardingUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetBoarding
        fields = '__all__'

class PetWalkerUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetWalker
        fields = '__all__'

