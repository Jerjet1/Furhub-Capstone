from rest_framework import serializers
from FurhubApi.models import Booking, Location, Pet, Pet_Form
from .PetSerializer import PetSerializer, PetFormSerializer

class ListBookingSerializer(serializers.ModelSerializer):

    # Customer details
    # customer_name = serializers.CharField(source='owner.user.get_full_name', read_only=True)
    customer_name = serializers.SerializerMethodField(read_only=True)
    customer_email = serializers.EmailField(source='owner.user.email', read_only=True)
    customer_phone = serializers.CharField(source='owner.user.phone_no', read_only=True)
    emergency_contact = serializers.CharField(source='owner.emergency_no', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    # Location details
    address = serializers.SerializerMethodField()
    
    # Pet details
    pets = serializers.SerializerMethodField()
    
    # Duration
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'booking_id',
            'customer_name',
            'customer_email',
            'customer_phone',
            'emergency_contact',
            'address',
            'pets',
            'duration',
            'start_at',
            'end_at',
            'status',
            'status_display',
            'created_at'
        ]
    
    def get_customer_name(self, obj):
        user = obj.owner.user
        return f"{user.first_name} {user.last_name}".strip()
        
    def get_address(self, obj):
        location = Location.objects.filter(user=obj.owner.user).first()
        if location:
            return f"{location.street}, {location.barangay}, {location.city.city_name}, {location.city.province.province_name}"
        return "Address not provided"
    
    def get_pets(self, obj):
        pet_forms = obj.pet_forms.all()
        return PetFormSerializer(pet_forms, many=True).data
    
    def get_duration(self, obj):
        return self.get_duration_display(obj)
    
    def get_duration_display(self, obj):
        if obj.duration_value and obj.duration_unit:
            unit = obj.duration_unit
            if unit == 'hour':
                return f"{obj.duration_value} hour(s)"
            elif unit == 'day':
                return f"{obj.duration_value} day(s)"
            elif unit == 'week':
                return f"{obj.duration_value} week(s)"
        return "Not specified"

class CreateBookingSerializer(serializers.ModelSerializer):
    pet_form = PetFormSerializer(many=True, write_only=True)

    class Meta:
        model = Booking
        fields = [
            'provider_service_id',  # Only need provider service ID from request
            'duration_value', 
            'duration_unit',
            'start_at',
            'end_at',
            'pet_forms'
        ]

    def create(self, validated_data):
        # Get the pet owner from the context (set in the view)
        pet_owner = self.context['pet_owner']
        pet_forms_data = validated_data.pop('pet_forms')
        
        # Create booking with the pet owner
        booking = Booking.objects.create(
            owner=pet_owner,  # Set automatically here
            **validated_data
        )
        
        # Create pet forms, ensuring pets belong to this owner
        for pet_form_data in pet_forms_data:
            pet_id = pet_form_data['pet_id']
            
            # Verify the pet belongs to this owner
            try:
                pet = Pet.objects.get(pet_id=pet_id, owner=pet_owner)
                
                Pet_Form.objects.create(
                    booking=booking,
                    pet=pet,
                    welfare_note=pet_form_data.get('welfare_note', '')
                )
            except Pet.DoesNotExist:
                raise serializers.ValidationError(
                    f"Pet with id {pet_id} not found or doesn't belong to you."
                )
        
        return booking
