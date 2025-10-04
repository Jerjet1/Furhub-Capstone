from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from FurhubApi.serializers.ImageUploadSerializer import UploadImageSerializer, ProviderDocumentSerializer
from FurhubApi.models import UploadedImage
from rest_framework.permissions import AllowAny, IsAuthenticated

class ProviderDocumentView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ProviderDocumentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            instance = serializer.save()
            # return created object (image_url available via serializer method)
            out = ProviderDocumentSerializer(instance, context={'request': request}).data
            return Response({"message": "Document uploaded successfully", "data": out}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProfileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UploadImageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            instance = serializer.save(user=request.user)
            out = UploadImageSerializer(instance, context={'request': request}).data
            return Response({"message": "Image uploaded successfully", "data": out}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        image = UploadedImage.objects.filter(
            user = request.user, category="profile_picture"
        ).order_by("-uploaded_at").first()

        if not image:
            return Response({"details": "No Profile image Found"}, status=status.HTTP_200_OK)
        
        serializer = UploadImageSerializer(image, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
# class BulkUploadImageView(APIView):
#     parser_classes = [MultiPartParser, FormParser]
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = BulkUploadImageSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Images uploaded successfully."}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)