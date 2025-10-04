from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from FurhubApi.models import Booking, ProviderService, PetOwner
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from FurhubApi.serializers.BookingSerializer import ListBookingSerializer, CreateBookingSerializer
from rest_framework.views import APIView

class PendingBookingBoardingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        tab = request.GET.get('tab', 'requests') # Get tab from query params

        # Map tab to status filters
        tab_filters = {
            'requests': ['pending'],
            'approved': ['approved'],  # For 'confirmed' tab
            'active': ['checked_in', 'ongoing'],  # For 'ongoing' tab
        }

        statuses = tab_filters.get(tab, ['pending'])  # Default to requests
        
        pending_booking = Booking.objects.filter(
            provider__provider=user,  # Changed from provider_service to provider
            status__in=statuses
        ).select_related(
            'owner',
            'owner__user'  # For user details
        ).prefetch_related(
            'pet_forms',
            'pet_forms__pet',  # For pet details in pet forms
            'owner__user__locations',  # For location data
            'owner__user__locations__city',  # For city data
            'owner__user__locations__city__province'  # For province data
        ).order_by('-created_at')

        paginator = PageNumberPagination()
        paginator.page_size = 3
        paginated_bookings = paginator.paginate_queryset(pending_booking, request)
        serializer = ListBookingSerializer(paginated_bookings, many=True)
        return paginator.get_paginated_response(serializer.data)

class ApprovingBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        try:
            booking = Booking.objects.get(
                booking_id=booking_id, 
                provider__provider=request.user
            )
            if booking.status != 'pending':
                return Response(
                    {"error": "Only pending bookings can be approved."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            booking.status = 'approved'
            booking.save()
            return Response(
                {"message": "Booking approved successfully."}, 
                status=status.HTTP_200_OK
            )
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found or you do not have permission."}, 
                status=status.HTTP_404_NOT_FOUND
            )

class DecliningBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, booking_id):
        try:
            booking = Booking.objects.get(
                booking_id=booking_id, 
                provider__provider=request.user
            )
            if booking.status != 'pending':
                return Response(
                    {"error": "Only pending bookings can be declined."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            booking.status = 'declined'
            booking.save()
            return Response(
                {"message": "Booking declined successfully."}, 
                status=status.HTTP_200_OK
            )
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found or you do not have permission."}, 
                status=status.HTTP_404_NOT_FOUND
            )

class RequestBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Get the pet owner for the current user
            pet_owner = PetOwner.objects.get(user=request.user)

            # Pass pet_owner to serializer context
            serializer = CreateBookingSerializer(
                data=request.data, 
                context={'pet_owner': pet_owner}
            )
            if serializer.is_valid():
                booking = serializer.save()
                # Return the created booking with all details
                return Response({
                    "booking_id": booking.booking_id,
                    "message": "Booking request submitted successfully",
                    "status": "pending"
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except PetOwner.DoesNotExist:
            return Response(
                {"error": "Pet owner profile not found. Please complete your profile."}, 
                status=status.HTTP_404_NOT_FOUND
            )

class PetOwnerBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            pet_owner = PetOwner.objects.get(user=request.user)

            # Get all bookings for this pet owner
            bookings = Booking.objects.filter(
                owner=pet_owner).select_related(
                'provider',
                'provider__provider'  # The service provider user
            ).prefetch_related(
                'pet_forms',
                'pet_forms__pet'
            ).order_by('-created_at')

            # Use your existing ListBookingSerializer for rich display
            serializer = ListBookingSerializer(bookings, many=True)
            return Response(serializer.data)
        except PetOwner.DoesNotExist:
            return Response(
                {"error": "Pet owner profile not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
class ListProviderBoardingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        owner = request.user.petowner
        owner_location = owner.user.locations.first()
        if not owner_location:
            return Response({"error": "Pet Owner location not set"}, status=status.HTTP_404_NOT_FOUND)
        
        user_lat, user_long = owner_location.latitude, owner_location.longitude



        