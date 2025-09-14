# from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from .models import User_logs, User_roles, Users, Roles, Service, PetOwner, PetBoarding, PetWalker
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser
from .permission import IsAdminRole
# import socket
from django.utils import timezone
from datetime import timedelta
from .utils import send_verification_email, get_client_ip
from FurhubApi.serializers import RegisterSerializer, LoginSerializer, EmailVerificationSerializer, UploadImageSerializer, ServiceSerializer, PetBoardingSerializer, PetWalkerSerializer
# Create your views here.
from rest_framework import generics

from rest_framework.decorators import action

from rest_framework import viewsets

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            with transaction.atomic():
                user = serializer.save()
                send_verification_email(user)

                refresh = RefreshToken.for_user(user)
                user_roles = User_roles.objects.filter(user=user).select_related('role')
                roles = [ur.role.role_name for ur in user_roles]
                petwalker_status = None
                petboarding_status = None

                if PetWalker.objects.filter(user=user).exists():
                    petwalker = PetWalker.objects.get(user=user)
                    petwalker_status = petwalker.status
                
                if PetBoarding.objects.filter(user=user).exists():
                    petboarding = PetBoarding.objects.get(user=user)
                    petboarding_status = petboarding.status

            return Response({
                "message": "Register Successfully. Check your email for verification",
                "email": user.email,
                "access": str(refresh.access_token),
                "roles": roles,
                "pet_walker": petwalker_status,
                "pet_boarding": petboarding_status,
                "is_verified": user.is_verified,
                "refresh": str(refresh),
                "user_id": user.user_id
                },status=status.HTTP_201_CREATED)
        
        except Exception as e:
            print(e)
            return Response({
            "message": "Registration failed due to an unexpected error",
            # "error": str(e)  # Be cautious about exposing raw errors in production
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # if serializer.is_valid():
        #     user = serializer.save()
        #     send_verification_email(user)
        #     return Response({
        #         "message": "Register Successfully. Check your email for verification",
        #         "email": user.email}, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CheckEmailExist(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        email = request.query_params.get('email')
        exists = Users.objects.filter(email=email).exists()
        if not exists:
            return Response(status=status.HTTP_200_OK)
        return Response({"exist": exists}, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(email = email, password = password)

            if user is not None:

                User_logs.objects.create(
                    user = user,
                    action = "Login",
                    ip_address = get_client_ip(request),
                )
                
                refresh = RefreshToken.for_user(user)
                user_roles = User_roles.objects.filter(user = user).select_related('role')
                roles = [ur.role.role_name for ur in user_roles]

                petwalker_status = None
                petboarding_status = None

                if PetWalker.objects.filter(user=user).exists():
                    petwalker = PetWalker.objects.get(user=user)
                    petwalker_status = petwalker.status
                
                if PetBoarding.objects.filter(user=user).exists():
                    petboarding = PetBoarding.objects.get(user=user)
                    petboarding_status = petboarding.status

                if not user.is_verified:
                    if user.code_expiry is None or user.code_expiry < timezone.now():
                        send_verification_email(user)
                    
                    return Response({
                        "access": str(refresh.access_token),
                        "refresh": str(refresh),
                        "roles": roles,
                        "is_verified": user.is_verified,
                        "pet_walker": petwalker_status,
                        "pet_boarding": petboarding_status,
                        "email": user.email,
                        "details": "Account not verified."
                    },status=status.HTTP_200_OK)
                
                print("LoginView is_verified:", user.is_verified)
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "roles": roles,
                    "email": user.email,
                    "is_verified": user.is_verified,
                    "pet_walker": petwalker_status,
                    "pet_boarding": petboarding_status,
                }, status=status.HTTP_200_OK)
            
            return Response({"details": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)       
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_roles = User_roles.objects.filter(user = user).select_related('role')
            refresh = RefreshToken.for_user(user)
            roles = [ur.role.role_name for ur in user_roles]

            petwalker_status = None
            petboarding_status = None

            if PetWalker.objects.filter(user=user).exists():
                petwalker = PetWalker.objects.get(user=user)
                petwalker_status = petwalker.status
            
            if PetBoarding.objects.filter(user=user).exists():
                petboarding = PetBoarding.objects.get(user=user)
                petboarding_status = petboarding.status

            return Response({
                "message": "Email verified successfully.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "roles": roles,
                "is_verified": user.is_verified,
                "pet_walker": petwalker_status,
                "email": user.email,
                "pet_boarding": petboarding_status,
                },status=status.HTTP_200_OK)
        return Response(serializer.errors, status=400)
    
class ResendCodeView(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = Users.objects.get(email=email)
            send_verification_email(user)
            return Response({"message": "Verification code resent."})
        except Users.DoesNotExist:
            return Response({"error": "Email not found."}, status=status.HTTP_400_BAD_REQUEST)
        
class UploadImageView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UploadImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Image Upload successfully",
            }, status=status.HTTP_201_CREATED)
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ServiceView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# class PendingPetWalker(APIView):
#     permission_classes = [IsAuthenticated, IsAdminRole]

#     def get(self, request):
#         queryset = PetWalker.objects.filter(status='pending')
#         serializer = PetWalkerSerializer(queryset, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# class PendingPetBoarding(APIView):
#     permission_classes = [IsAuthenticated, IsAdminRole]

#     def get(self, request):
#         queryset = PetBoarding.objects.filter(status='pending')
#         serializer = PetBoardingSerializer(queryset, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    
class PendingProviders(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        pet_walker_queryset = PetWalker.objects.filter(status='pending')
        pet_walker_serializer = PetWalkerSerializer(pet_walker_queryset, many=True)

        pet_boarding_queryset = PetBoarding.objects.filter(status='pending')
        pet_boarding_serializer = PetBoardingSerializer(pet_boarding_queryset, many=True)

        data = {
            "pet_walkers": pet_walker_serializer.data,
            "pet_boardings": pet_boarding_serializer.data,
        }
        return Response(data, status=status.HTTP_200_OK)
    


# class BulkUploadImageView(APIView):
#     parser_classes = [MultiPartParser, FormParser]
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = BulkUploadImageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Images uploaded successfully."}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)