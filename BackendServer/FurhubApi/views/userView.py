# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from FurhubApi.models import Service, PetOwner, PetBoarding, PetWalker
from rest_framework.parsers import MultiPartParser, FormParser
from FurhubApi.permission import IsAdminRole
# import socket
from FurhubApi.serializers import ServiceSerializer, PetBoardingSerializer, PetWalkerSerializer
# Create your views here.



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

# class BulkUploadImageView(APIView):
#     parser_classes = [MultiPartParser, FormParser]
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = BulkUploadImageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Images uploaded successfully."}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)