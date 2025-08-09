# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from FurhubApi.models import Service, PetOwner, PetBoarding, PetWalker, Users
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination
from FurhubApi.permission import IsAdminRole
# import socket
from FurhubApi.serializers import ServiceSerializer, PetBoardingSerializer, PetWalkerSerializer, UserSerializer
# Create your views here.

# class PendingProviders(APIView):
#     permission_classes = [IsAuthenticated, IsAdminRole]

#     paginator = PageNumberPagination()
#     paginator.page_size = 9

#     def get(self, request):
#         pet_walker_queryset = PetWalker.objects.filter(status='pending')
#         pet_walker_serializer = PetWalkerSerializer(pet_walker_queryset, many=True)

#         pet_boarding_queryset = PetBoarding.objects.filter(status='pending')
#         pet_boarding_serializer = PetBoardingSerializer(pet_boarding_queryset, many=True)

#         data = {
#             "pet_walkers": pet_walker_serializer.data,
#             "pet_boardings": pet_boarding_serializer.data,
#         }

#         return Response(data, status=status.HTTP_200_OK)

class PendingPetBoarding(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    paginator = PageNumberPagination()
    paginator.page_size = 9

    def get(self, request):
        queryset = PetBoarding.objects.filter(status='pending').order_by("user")
        result_page = self.paginator.paginate_queryset(queryset, request)
        serializer = PetBoardingSerializer(result_page, many=True)
        return self.paginator.get_paginated_response(serializer.data)
    
class PendingPetWalker(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    paginator = PageNumberPagination()
    paginator.page_size = 9

    def get(self, request):
        queryset = PetWalker.objects.filter(status='pending').order_by("user")
        result_page = self.paginator.paginate_queryset(queryset, request)
        serializer = PetWalkerSerializer(result_page, many=True)
        return self.paginator.get_paginated_response(serializer.data)

    
class ServiceView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class AllUserView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    paginator = PageNumberPagination()
    paginator.page_size = 9

    def get(self, request):

        users = Users.objects.all().order_by('id').filter(is_verified = True)
        result_page = self.paginator.paginate_queryset(users, request)
        serializer = UserSerializer(result_page, many=True)

        # return Response(serializer.data)

        return self.paginator.get_paginated_response(serializer.data)


# class BulkUploadImageView(APIView):
#     parser_classes = [MultiPartParser, FormParser]
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = BulkUploadImageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Images uploaded successfully."}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)