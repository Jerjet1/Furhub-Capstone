from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Province, City, Barangay
from ..serializers.managelocationserializer import ProvinceSerializer, CitySerializer, BarangaySerializer

# Province
# Add Province
class ProvinceCreateView(APIView):
    permission_classes = [IsAdminUser]  # Only staff/admin can access

    def post(self, request):
        serializer = ProvinceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Add City
class CityCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = CitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Add Barangay
class BarangayCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = BarangaySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
