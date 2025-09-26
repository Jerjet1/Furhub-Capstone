from rest_framework import serializers
from FurhubApi.models import ProviderApplication, Users, Roles, PetBoarding, PetWalker, User_roles
from .ImageUploadSerializer import ProviderDocumentSerializer


class WalkerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderApplication
        fields = ["application_id","user", "provider_type", "email", "first_name", "last_name",]
        # fields = ["user", "provider_type", "first_name", "last_name", "location", "status"]
        extra_kwargs = {
            "user": {"required": False}  # 🔑 don’t force it
        }

    def validate(self, data):
        if data.get("provider_type") != "walker":
            raise serializers.ValidationError("Invalid provider type for this serializer")
        return data


class BoardingApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderApplication
        # fields = ["user", "provider_type", "facility_name", "location", "status"]
        fields = ["application_id","user", "provider_type", "email", "facility_name"]
        extra_kwargs = {
            "user": {"required": False}  # 🔑 don’t force it
        }

    def validate(self, data):
        if data.get("provider_type") != "boarding":
            raise serializers.ValidationError("Invalid provider type for this serializer")
        return data

class ProviderApplicationSerializer(serializers.ModelSerializer):
    documents = ProviderDocumentSerializer(many=True, read_only=True)
    provider_type_display = serializers.CharField(source="get_provider_type_display", read_only=True)
    class Meta:
        model = ProviderApplication
        # fields = ["application_id", "provider_type", "email", "first_name", "last_name", "facility_name", "location", "status", "documents", "applied_at"]
        fields = ["application_id", "provider_type","provider_type_display", 
                  "email", "first_name", "last_name", "facility_name", 
                  "status", "documents", "applied_at"]
        read_only_fields = ["application_id", "applied_at", "documents"]

class ProviderRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Users
        fields = ['first_name', 'last_name', 'phone_no', 'email', 'password', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def validate_email(self, value):
        if Users.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email is already in use.')
        return value
    
    def create(self, validated_data):
        # Extract provider-specific data from context
        application = self.context.get('application')
        provider_type = self.context.get('provider_type')

        validated_data.pop('confirm_password')

        # Create user
        user = Users.objects.create_user(**validated_data)

        # Assign provider role and create provider profile
        if provider_type == 'walker':
            role = Roles.objects.get(role_name='Walker')
            PetWalker.objects.create(user=user)
        elif provider_type == 'boarding':
            role = Roles.objects.get(role_name='Boarding')
            PetBoarding.objects.create(user=user, hotel_name=application.facility_name)

        User_roles.objects.create(user=user, role=role)

        # Link application to user
        if application:
            application.user = user
            application.save()
        
        return user