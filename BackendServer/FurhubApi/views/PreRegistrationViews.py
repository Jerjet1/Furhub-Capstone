from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from FurhubApi.permission import IsAdminRole
from rest_framework.views import APIView
from FurhubApi.models import ProviderApplication
from django.db import transaction
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
# from rest_framework.parsers import MultiPartParser, FormParser
# import socket
from FurhubApi.serializers.PreRegistrationSerializer import (
    BoardingApplicationSerializer,
    ProviderApplicationSerializer,
    WalkerApplicationSerializer,
)

class ProviderApplicationView(APIView):
    permission_classes = [AllowAny]

    def validate_input(self, email, facility_name, provider_type):
        """Validate basic input parameters"""
        # Validate provider type
        if provider_type not in ['boarding', 'walker']:
            return {"error": "Invalid provider_type. Must be 'boarding' or 'walker'."}
        
        # Validate email format
        try:
            validate_email(email)
        except ValidationError:
            return {"error": "Invalid email format."}
        
        # Clean facility name if provided
        if facility_name:
            facility_name = facility_name.strip().lower()
            if len(facility_name) < 2:
                return {"error": "Facility name must be at least 2 characters long."}
        
        return None
    
    def check_existing_applications(self, email, provider_type, facility_name):
        """Check for existing applications with case-insensitive matching"""
        email = email.lower().strip()
        
        # Check for recent submissions from same IP (additional spam prevention)
        # client_ip = self.request.META.get('REMOTE_ADDR')
        # recent_submissions = ProviderApplication.objects.filter(
        #     ip_address=client_ip,
        #     created_at__gte=timezone.now() - timedelta(hours=24)
        # ).count()
        
        # if recent_submissions >= 3:  # Limit to 3 applications per IP per day
        #     return {"error": "Too many applications from this IP address. Please try again later."}
        
        # Check for existing applications with same email (case-insensitive)
        existing_email_apps = ProviderApplication.objects.filter(
            email__iexact=email,
            provider_type=provider_type
        )


        
        if existing_email_apps.filter(status__in=["pending", "approved"]).exists():
            return {
                "error": f"An application with this email already exists."
            }
        
        # Check facility name if provided (case-insensitive)
        if facility_name:
            facility_name = facility_name.lower().strip()
            existing_facility = ProviderApplication.objects.filter(
                facility_name__iexact=facility_name
            ).exists()
            
            if existing_facility:
                return {"error": "An application with this facility name already exists."}
        
        return None    

    def post(self, request):
        try:
            provider_type = request.data.get("provider_type", "").strip().lower()
            email = request.data.get("email", "").strip().lower()
            facility_name = request.data.get("facility_name", "").strip()
            
            # Input validation
            validation_error = self.validate_input(email, facility_name, provider_type)

            if validation_error:
                return Response(validation_error, status=status.HTTP_400_BAD_REQUEST)
            
            # Check for existing applications
            existing_app_error = self.check_existing_applications(email, provider_type, facility_name)
            if existing_app_error:
                return Response(existing_app_error, status=status.HTTP_400_BAD_REQUEST)

            # Select appropriate serializer
            if provider_type == "boarding":
                serializer_class = BoardingApplicationSerializer
            else:  # walker
                serializer_class = WalkerApplicationSerializer

            serializer = serializer_class(data=request.data)
            
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Save with transaction and include IP address
            with transaction.atomic():
                application = serializer.save()

            return Response(
                {
                    "message": f"{provider_type.capitalize()} application submitted successfully.",
                    "application_id": application.application_id,
                },
                status=status.HTTP_201_CREATED,
            )
            
        except Exception as e:
            return Response(
                {
                    "error": "Application submission failed due to an unexpected error",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class ProviderApplicationListView(APIView):
    permission_classes = [IsAdminRole, IsAuthenticated]

    def get(self, request):
        status_filter = request.query_params.get("status", None)
        provider_type_filter = request.query_params.get("provider_type", None)
        search_query = request.query_params.get("search", None)  # Add search parameter

        applications = ProviderApplication.objects.all()

        # filter by status
        if status_filter:
            applications = applications.filter(status=status_filter)

        # filter by provider_type
        if provider_type_filter:
            applications = applications.filter(provider_type=provider_type_filter)
        
                # ADD SEARCH FUNCTIONALITY
        if search_query:
            applications = applications.filter(
                Q(facility_name__icontains=search_query) |
                Q(email__icontains=search_query) |
                Q(first_name__icontains=search_query) |
                Q(last_name__icontains=search_query) |
                Q(application_id__icontains=search_query)
            )

        applications = applications.order_by("-applied_at")

        paginator = PageNumberPagination()
        paginator.page_size = 5
        result_page = paginator.paginate_queryset(applications, request)

        serializer = ProviderApplicationSerializer(
            result_page, 
            many=True, 
            context={'request': request}
        )
        return paginator.get_paginated_response(serializer.data)
        
      