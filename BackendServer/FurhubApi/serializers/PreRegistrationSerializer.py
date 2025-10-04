from rest_framework import serializers
from FurhubApi.models import ProviderApplication, Users, Roles, PetBoarding, PetWalker, User_roles, City, Province, Location
from .ImageUploadSerializer import ProviderDocumentSerializer

# --- Location Serializer (only model fields, no province) ---
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["city", "barangay", "street", "latitude", "longitude"]

# --- Boarding Application Serializer ---
class BoardingApplicationSerializer(serializers.ModelSerializer):
    location_data = serializers.DictField(write_only=True)  # accepts province, city, etc.

    class Meta:
        model = ProviderApplication
        fields = ["application_id", "user", "provider_type", "email", "facility_name", "location_data"]
        extra_kwargs = {
            "user": {"required": False}
        }
    
    def validate(self, data):
        if data.get("provider_type") != "boarding":
            raise serializers.ValidationError("Invalid provider type for this serializer")
        return data

    def create(self, validated_data):
        location_data = validated_data.pop("location_data")

        # --- Province ---
        province_name = location_data.get("province")
        if not province_name:
            raise serializers.ValidationError({"province": "Province is required."})
        province, _ = Province.objects.get_or_create(
            province_name__iexact=province_name,
            defaults={"province_name": province_name}
        )

        # --- City ---
        city_name = location_data.get("city")
        if not city_name:
            raise serializers.ValidationError({"city": "City is required."})
        city, _ = City.objects.get_or_create(
            city_name=city_name.strip(),
            province=province
        )

        # --- Location ---
        location = Location.objects.create(
            city=city,
            barangay=location_data.get("barangay"),
            street=location_data.get("street"),
            latitude=location_data.get("latitude"),
            longitude=location_data.get("longitude"),
        )

        # --- ProviderApplication ---
        application = ProviderApplication.objects.create(
            location=location,
            **validated_data
        )
        return application

# --- Walker Application Serializer ---
class WalkerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderApplication
        fields = ["application_id", "user", "provider_type", "email", "first_name", "last_name"]
        extra_kwargs = {
            "user": {"required": False}
        }

    def validate(self, data):
        if data.get("provider_type") != "walker":
            raise serializers.ValidationError("Invalid provider type for this serializer")
        return data

class ProviderApplicationSerializer(serializers.ModelSerializer):
    documents = ProviderDocumentSerializer(many=True, read_only=True)
    provider_type_display = serializers.CharField(source="get_provider_type_display", read_only=True)

    # Use SerializerMethodField to safely handle missing location data
    city = serializers.SerializerMethodField()
    province = serializers.SerializerMethodField()
    barangay = serializers.SerializerMethodField()
    street = serializers.SerializerMethodField()
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = ProviderApplication
        fields = [
            "application_id",
            "provider_type",
            "provider_type_display",
            "email",
            "first_name",
            "last_name",
            "facility_name",
            "status",
            "documents",
            "applied_at",
            "province",
            "city",
            "barangay",
            "street",
            "latitude",
            "longitude",
        ]
        read_only_fields = ["application_id", "applied_at", "documents"]

    # Methods to safely get location fields
    def get_city(self, obj):
        return obj.location.city.city_name if obj.location and obj.location.city else ""

    def get_province(self, obj):
        return obj.location.city.province.province_name if obj.location and obj.location.city and obj.location.city.province else ""

    def get_barangay(self, obj):
        return obj.location.barangay if obj.location else ""

    def get_street(self, obj):
        return obj.location.street if obj.location else ""

    def get_latitude(self, obj):
        return obj.location.latitude if obj.location else None

    def get_longitude(self, obj):
        return obj.location.longitude if obj.location else None

    def create(self, validated_data):
        # Extract location fields if provided
        location_fields = {}
        for field in ["latitude", "longitude", "province", "city", "barangay", "street"]:
            if field in validated_data:
                location_fields[field] = validated_data.pop(field)

        # Create provider application
        application = ProviderApplication.objects.create(**validated_data, **location_fields)
        return application
    
class ProviderRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Users
        fields = ['first_name', 'last_name', 'phone_no', 'email', 'password', 'confirm_password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        # Check if passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def validate_email(self, value):
        # Ensure email is unique
        if Users.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email is already in use.')
        return value

    def create(self, validated_data):
        # Extract context data
        application = self.context.get('application')
        provider_type = self.context.get('provider_type')

        # Remove confirm_password
        validated_data.pop('confirm_password')

        # Create the user
        user = Users.objects.create_user(**validated_data)

        # Assign provider role and create profile
        if provider_type == 'walker':
            role = Roles.objects.get(role_name='Walker')
            PetWalker.objects.create(user=user)
        elif provider_type == 'boarding':
            role = Roles.objects.get(role_name='Boarding')
            PetBoarding.objects.create(
                user=user, 
                hotel_name=application.facility_name
            )

        # Assign role to user
        User_roles.objects.create(user=user, role=role)

        # Link the existing ProviderApplication location to this user
        if application.location:
            application.location.user = user
            application.location.save()

        # Link application to user
        application.user = user
        application.save()

        return user