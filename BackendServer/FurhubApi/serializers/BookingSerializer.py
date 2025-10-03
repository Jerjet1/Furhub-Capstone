from rest_framework import serializers
from FurhubApi.models import Booking
from .PetSerializer import PetSerializer

class BookingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Booking
        fields = ['booking_id, owner, provider, start_at, end_at']
        extra_kwargs = {
            "booking_id": {"required": False}  # 🔑 don’t force it
        }