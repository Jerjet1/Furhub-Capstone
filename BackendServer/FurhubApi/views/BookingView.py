from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from FurhubApi.models import Booking, ProviderService
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from FurhubApi.serializers.BookingSerializer import BookingSerializer
from rest_framework.views import APIView

class PendingBookingListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # pending bookings for current providers boarding facility
        pending_booking = Booking.objects.filter(
            provider_service__provider = user,
            provider_service__provider_type = 'boarding',
            status='pending'
        ).select_related('user', 'provider_service').order_by('-created_at')

        paginator = PageNumberPagination()
        paginator.page_size = 3
        paginated_bookings = paginator.paginate_queryset(pending_booking, request)
        serializer = BookingSerializer(paginated_bookings, many=True)
        return paginator.get_paginated_response(serializer.data)

class RequestBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        pass
    
class ListProviderBoardingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        owner = request.user.petowner
        owner_location = owner.user.locations.first()
        if not owner_location:
            return Response({"error": "Pet Owner location not set"}, status=status.HTTP_404_NOT_FOUND)
        
        user_lat, user_long = owner_location.latitude, owner_location.longitude



        