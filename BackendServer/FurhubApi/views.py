# from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .serializer import RegisterSerializer, LoginSerializer, EmailVerificationSerializer
from .models import User_logs, User_roles, Users
from django.db import transaction
# import socket
from django.utils.timezone import now
from .utils import send_verification_email, get_client_ip
# Create your views here.

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
            return Response({"message": "Register Successfully. Check your email for verification",
                                "email": user.email}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response({
            "message": "Registration failed due to an unexpected error",
            "error": str(e)  # Be cautious about exposing raw errors in production
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        # if serializer.is_valid():
        #     user = serializer.save()
        #     send_verification_email(user)
        #     return Response({
        #         "message": "Register Successfully. Check your email for verification",
        #         "email": user.email}, status=status.HTTP_201_CREATED)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            user = authenticate(email = email, password = password)

            if user is not None:
                if not user.is_verified:
                    send_verification_email(user)
                    return Response({
                        "is_verified": False,
                        "email": user.email,
                        "details": "Account not verified."}
                        ,status=status.HTTP_403_FORBIDDEN)
                
                User_logs.objects.create(
                    user = user,
                    action = "Login",
                    ip_address = get_client_ip(request),
                )
                user_roles = User_roles.objects.filter(user = user).select_related('role')
                roles = [ur.role.role_name for ur in user_roles]
                print(roles)
                refresh = RefreshToken.for_user(user)
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "roles": roles,
                })
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
            access_token = str(refresh.access_token)
            roles = [ur.role.role_name for ur in user_roles]
            return Response({
                "message": "Email verified successfully.",
                "access": access_token,
                "roles": roles
                },status=200)
        return Response(serializer.errors, status=400)
    
class ResendCodeView(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = Users.objects.get(email=email)
            send_verification_email(user)
            return Response({"message": "Verification code resent."})
        except Users.DoesNotExist:
            return Response({"error": "Email not found."}, status=404)