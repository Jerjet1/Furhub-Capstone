# from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework import viewsets, permissions
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from .models import User_logs, User_roles, Users, Roles, Service, PetOwner, PetBoarding, PetWalker,ChatRoom, ChatMessage
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser
from .permission import IsAdminRole
# import socket
from django.utils.timezone import now
from .utils import send_verification_email, get_client_ip
from .serializer import RegisterSerializer, LoginSerializer, EmailVerificationSerializer, UploadImageSerializer, ServiceSerializer, PetBoardingSerializer, PetWalkerSerializer,ChatRoomSerializer, ChatMessageSerializer
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
            return Response({
                "message": "Register Successfully. Check your email for verification",
                "email": user.email,
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

class PendingPetWalker(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        queryset = PetWalker.objects.filter(status='pending')
        serializer = PetWalkerSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PendingPetBoarding(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def get(self, request):
        queryset = PetBoarding.objects.filter(status='pending')
        serializer = PetBoardingSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user1_id = self.request.query_params.get('user1')
        user2_id = self.request.query_params.get('user2')

        if user1_id and user2_id:
            return ChatRoom.objects.filter(
                Q(user1_id=user1_id, user2_id=user2_id) |
                Q(user1_id=user2_id, user2_id=user1_id)
            )
        return super().get_queryset()

    @action(detail=False, methods=['post'], url_path='get-or-create')
    def get_or_create_room(self, request):
        user1 = request.user
        user2_id = request.data.get('user2')

        if not user2_id:
            return Response({'error': 'user2 is required'}, status=400)

        try:
            user2 = Users.objects.get(pk=user2_id)
        except Users.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        # Order users by ID to ensure uniqueness
        user_low, user_high = sorted([user1, user2], key=lambda u: u.pk)

        room, created = ChatRoom.objects.get_or_create(
            user1=user_low,
            user2=user_high
        )

        serializer = self.get_serializer(room)
        return Response(serializer.data, status=200)


class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.request.query_params.get('room')
        if room_id:
            return ChatMessage.objects.filter(room_id=room_id).order_by('timestamp')
        return super().get_queryset()

    def perform_create(self, serializer):
        sender = self.request.user
        recipient_id = self.request.data.get('recipient')

        if not recipient_id:
            raise serializers.ValidationError("Recipient ID is required.")

        try:
            recipient = Users.objects.get(pk=recipient_id)
        except Users.DoesNotExist:
            raise serializers.ValidationError("Invalid recipient ID.")

        # Get or create ChatRoom
        user_low, user_high = sorted([sender, recipient], key=lambda u: u.pk)
        room, _ = ChatRoom.objects.get_or_create(user1=user_low, user2=user_high)

        # Save message with sender, recipient, and room
        serializer.save(sender=sender, recipient=recipient, room=room)

    @action(detail=False, methods=['get'], url_path='history/(?P<user1_id>[^/.]+)/(?P<user2_id>[^/.]+)')
    def history(self, request, user1_id=None, user2_id=None):
        messages = ChatMessage.objects.filter(
            (Q(sender__id=user1_id) & Q(recipient__id=user2_id)) |
            (Q(sender__id=user2_id) & Q(recipient__id=user1_id))
        ).order_by('timestamp')
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)


# OPTIONAL: if using this standalone, not needed if you're using the ViewSet above
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def get_or_create_room(request):
    user1 = request.user
    user2_id = request.data.get("user2_id")

    if not user2_id:
        return Response({"error": "user2_id is required"}, status=400)

    try:
        user2 = Users.objects.get(pk=user2_id)
    except Users.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    room, _ = ChatRoom.objects.get_or_create(
        user1=min(user1, user2, key=lambda x: x.pk),
        user2=max(user1, user2, key=lambda x: x.pk)
    )

    serializer = ChatRoomSerializer(room)
    return Response(serializer.data, status=200)

# class BulkUploadImageView(APIView):
#     parser_classes = [MultiPartParser, FormParser]
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = BulkUploadImageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Images uploaded successfully."}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)