from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .serializer import RegisterSerializer, LoginSerializer
# Create your views here.

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Post, Comment, Reaction

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Register Successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
                    return Response({"details": "Account not verified."}, status=status.HTTP_403_FORBIDDEN)
                
                refresh = RefreshToken.for_user(user)
                return Response({
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                })
            return Response({"details": "invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        
<<<<<<< Updated upstream
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
=======
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
>>>>>>> Stashed changes
