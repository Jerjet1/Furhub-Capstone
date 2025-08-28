from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from FurhubApi.serializers import UploadImageSerializer
from FurhubApi.models import UploadedImage
from rest_framework.permissions import AllowAny, IsAuthenticated


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

class ProfileUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UploadImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({
                "message": "Image Upload successfully",
            }, status=status.HTTP_201_CREATED)
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        image = UploadedImage.objects.filter(
            user = request.user, category="profile_picture"
        ).order_by("-uploaded_at").first()

        if not image:
            return Response({"details": "No Profile image Found"}, status=status.HTTP_404_NOT_FOUND)
        
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