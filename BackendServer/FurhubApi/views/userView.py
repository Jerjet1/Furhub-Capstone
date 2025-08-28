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
from FurhubApi.serializers import (ServiceSerializer, PetBoardingSerializer, PetWalkerSerializer, 
                                   UserSerializer, PetWalkerUpdateProfileSerializer, PetOwnerUpdateProfileSerializer, 
                                   PetBoardingUpdateProfileSerializer)
# Create your views here.

class BaseUserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        
        serializer = UserSerializer(user, data=request.data, partial = True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(
            serializer.data, status=status.HTTP_200_OK
        )

class PetWalkerUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    def patch(self, request):
        try:
            walker = request.user.petwalker
        except PetWalker.DoesNotExist:
            return Response({"detail": "Walker Profile not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PetWalkerUpdateProfileSerializer(walker, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PetOwnerUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            owner = request.user.petowner
        except PetOwner.DoesNotExist:
            return Response({"detail": "Pet Owner not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PetOwnerUpdateProfileSerializer(owner, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        user = request.user
        serializer = PetOwnerUpdateProfileSerializer(user)

        return Response(
            serializer.data, status=status.HTTP_200_OK
        )
    
class PetBoardingUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            boarding = request.user.petboarding
        except PetBoarding.DoesNotExist:
            return Response({"detail": "Pet Boarding not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PetBoardingUpdateProfileSerializer(boarding, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminUpdateView(APIView):
    permission_classes = [IsAdminRole, IsAuthenticated]

    def patch(self, request, pk):
        pass

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
