from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from ..models import Location
from FurhubApi.serializers.Locationserializer import LocationSerializer , UpdateAddressSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all().order_by("-created_at")
    serializer_class = LocationSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Enable filtering & searching
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["province", "city", "barangay"]
    search_fields = ["province", "city", "barangay", "street"]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class UpdateAddressView(generics.UpdateAPIView):
    serializer_class = UpdateAddressSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.petowner

class UserLatestLocationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the latest location for the logged-in user
        latest_location = (
            Location.objects.filter(user=request.user)
            .order_by("-created_at")
            .first()
        )
        if not latest_location:
            return Response({"address": None})
        
        return Response({
            "address": str(latest_location),  # uses __str__ method
            "latitude": latest_location.latitude,
            "longitude": latest_location.longitude,
            "province": latest_location.province,
            "city": latest_location.city,
            "barangay": latest_location.barangay,
            "street": latest_location.street,
        })
