from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from FurhubApi.permission import IsAdminRole
from rest_framework.views import APIView
from FurhubApi.models import ProviderApplication, User_roles
from django.db import transaction
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from FurhubApi.utils import send_approval_email, send_rejection_email, send_verification_email
# from rest_framework.parsers import MultiPartParser, FormParser
# import socket
from FurhubApi.serializers.PreRegistrationSerializer import (
    BoardingApplicationSerializer,
    ProviderApplicationSerializer,
    WalkerApplicationSerializer,
    ProviderRegistrationSerializer
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
            print("ProviderApplicationView error:", str(e))
            return Response(
                {
                    "error": "Application submission failed due to an unexpected error",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        
class ApprovedProviderApplicationView(APIView):
    permission_classes = [IsAdminRole, IsAuthenticated]

    def post(self, request, application_id):
        try:
            application = ProviderApplication.objects.get(application_id=application_id)
            if application.status == "approved":
                return Response(
                    {"message": "Application is already approved."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
            # Update status to approved
            application.status = "approved"
            application.save()

            # send email notification to applicant
            email_sent = send_approval_email(application)

            return Response(
                {"message" : "Application approved successfully.",
                 "email_sent": email_sent,
                },
                status=status.HTTP_200_OK
            )
        except ProviderApplication.DoesNotExist:
            return Response(
                {"error" : "Application not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Failed to approve application due to unexpected error."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class RejectProviderApplicationView(APIView):
    permission_classes = [IsAdminRole, IsAuthenticated]

    def post(self, request, application_id):
        try:
            application = ProviderApplication.objects.get(application_id=application_id)
            reject_reason = request.data.get("reject_reason", "").strip()

            if application.status == "rejected":
                return Response(
                    {"error": "Application is already rejected."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update status to rejected
            application.status = "rejected"
            application.reject_reason = reject_reason
            application.save()

            # send email notification to applicant about rejection
            email_sent = send_rejection_email(application)

            return Response(
                {"message": "Application rejected successfully.",
                "email_sent": email_sent
                },
                status=status.HTTP_200_OK
            )

        except ProviderApplication.DoesNotExist:
            return Response(
                {"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": "Failed to reject application due to unexpected error."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
    
class ProviderRegistrationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token):
        """
        Validate registration token and return application details including location
        """
        try:
            application = ProviderApplication.objects.get(
                registration_token=token,
                status="approved"
            )

            if not application.is_token_valid():
                return Response(
                    {
                        "error": "Registration link has expired. Please contact support.",
                        "expired": True,
                        "application": {
                            "application_id": application.application_id,
                            "email": application.email,
                        }
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if application.user:
                return Response(
                    {"error": "Registration already completed. Please login."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Include location if available
            location = application.location
            location_data = None
            if location:
                location_data = {
                    "province": location.city.province.province_name if location.city and location.city.province else None,
                    "city": location.city.city_name if location.city else None,
                    "barangay": location.barangay,
                    "street": location.street,
                    "latitude": location.latitude,
                    "longitude": location.longitude
                }

            data = {
                "valid": True,
                "application": {
                    "application_id": application.application_id,
                    "email": application.email,
                    "first_name": application.first_name,
                    "last_name": application.last_name,
                    "facility_name": application.facility_name,
                    "provider_type": application.provider_type,
                    "provider_type_display": application.get_provider_type_display(),
                    "location": location_data
                },
                "token_expiry": application.token_expiry
            }

            return Response(data)

        except ProviderApplication.DoesNotExist:
            return Response(
                {"error": "Invalid registration link"},
                status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, token):
        """
        Complete provider registration with account creation
        """
        try:
            application = ProviderApplication.objects.get(
                registration_token=token,
                status='approved'
            )

            if not application.is_token_valid():
                return Response(
                    {"error": "Registration link has expired"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if application.user:
                return Response(
                    {"error": "Registration already completed"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = ProviderRegistrationSerializer(
                data=request.data,
                context={
                    'application': application,
                    'provider_type': application.provider_type
                }
            )

            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            try:
                with transaction.atomic():
                    user = serializer.save()

                    # Link user's location from application
                    if application.location:
                        application.location.user = user
                        application.location.save()

                    send_verification_email(user)

                    application.registration_token = None
                    application.token_expiry = None
                    application.save()

                    refresh = RefreshToken.for_user(user)
                    user_roles = User_roles.objects.filter(user=user).select_related('role')
                    roles = [ur.role.role_name for ur in user_roles]

                return Response({
                    "message": "Provider registration completed successfully. Please verify your email.",
                    "email": user.email,
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "roles": roles,
                    "provider_type": application.provider_type,
                    "is_verified": user.is_verified,
                    "user_id": user.id
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                print(f"Registration error: {e}")
                return Response({
                    "message": "Registration failed due to an unexpected error",
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except ProviderApplication.DoesNotExist:
            return Response(
                {"error": "Invalid registration link"},
                status=status.HTTP_404_NOT_FOUND
            )


class ResendRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        app_id = request.data.get("application_id")
        email = request.data.get("email")
        if not email or not app_id:
            print("error here")
            return Response({"detail": "Missing fields"}, status=400)

        try:
            application = ProviderApplication.objects.get(
                application_id=app_id, 
                email=email, 
                status='approved')
        except ProviderApplication.DoesNotExist:
            return Response({"error": "Invalid application"}, status=400)
        
        if application.is_token_valid():
            return Response(
                {"error": "Token is still valid. Please use the existing link."}
            )
        
        #generate new token + expiry
        application.generate_registration_token()

        email_sent = send_approval_email(application)

        return Response(
            {
                "message": f"New Link has been sent to your email {application.email}"
            }, 
            status=status.HTTP_200_OK)
        