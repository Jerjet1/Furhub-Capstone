from rest_framework import serializers
from FurhubApi.models import Users, PetWalker, PetBoarding, PetOwner, BoardingPolicy, BoardingRate, OperationalHours
from .ProviderSerializer import BoardingPolicySerializer, BoardingRateSerializer, OperationalHourSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_no']

class PetOwnerUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetOwner
        fields = ['emergency_no', 'bio']

class PetBoardingUpdateProfileSerializer(serializers.ModelSerializer):
    boarding_policy = BoardingPolicySerializer(many=True, required=False)
    boarding_rate = BoardingRateSerializer(required=False)
    operational_hours = OperationalHourSerializer(many=True, required=False)
    
    class Meta:
        model = PetBoarding
        fields = ['user', 'hotel_name', 'max_capacity', 'facility_phone', 'boarding_policy', 'boarding_rate', 'operational_hours']

    def create(self, validated_data):
        policies_data = validated_data.pop('boarding_policy', [])
        rates_data = validated_data.pop('boarding_rate', {})
        hours_data = validated_data.pop('operational_hours', [])

        boarding = PetBoarding.objects.create(**validated_data)

        # Create related records
        for policy in policies_data:
            BoardingPolicy.objects.create(pet_boarding=boarding, **policy)

        # Handle boarding_rate (OneToOne relationship)
        if rates_data:
            BoardingRate.objects.create(pet_boarding=boarding, **rates_data)

        for hour in hours_data:
            OperationalHours.objects.create(provider=boarding.user, **hour)
        
        return boarding
    
    def update(self, instance, validated_data):
        policies_data = validated_data.pop('boarding_policy', [])
        rates_data = validated_data.pop('boarding_rate', {})
        hours_data = validated_data.pop('operational_hours', [])

        # Update PetBoarding main fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update policies (update existing instead of delete/create)
        if policies_data:
            # Remove foreign keys
            for policy in policies_data:
                policy.pop('pet_boarding', None)
            
            # Update or create policies
            for policy_data in policies_data:
                # You might want to add a unique identifier to update specific policies
                BoardingPolicy.objects.update_or_create(
                    pet_boarding=instance,
                    policy_type=policy_data.get('policy_type'),
                    defaults=policy_data
                )

        # Update boarding_rate
        if rates_data:
            rates_data.pop('pet_boarding', None)
            BoardingRate.objects.update_or_create(
                pet_boarding=instance,
                defaults=rates_data
            )

        # Update operational hours
        if hours_data:
            for hour_data in hours_data:
                hour_data.pop('provider', None)
                OperationalHours.objects.update_or_create(
                    provider=instance.user,
                    day=hour_data.get('day'),
                    defaults=hour_data
                )

        return instance
    
    def to_representation(self, instance):
        """
        Ensure operational_hours are returned from the provider (Users) related records.
        OperationalHours are linked to Users (provider), not PetBoarding, so fetch them here.
        """
        ret = super().to_representation(instance)
        try:
            hours_qs = OperationalHours.objects.filter(provider=instance.user).order_by('day')
            ret['operational_hours'] = OperationalHourSerializer(hours_qs, many=True).data
        except Exception:
            ret['operational_hours'] = []
        return ret

class PetWalkerUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetWalker
        fields = '__all__'

