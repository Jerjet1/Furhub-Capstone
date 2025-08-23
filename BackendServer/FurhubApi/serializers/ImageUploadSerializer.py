from rest_framework import serializers
from FurhubApi.models import UploadedImage

class UploadImageSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(use_url = True)

    class Meta:
        model = UploadedImage
        fields = ['image', 'category', 'label', 'uploaded_at']

# class BulkUploadImageSerializer(serializers.Serializer):
#     images = UploadImageSerializer(many=True)

#     def create(self, validated_data):
#         images_data = validated_data.pop('images')
#         uploaded_images = []
#         for image_data in images_data:
#             uploaded_images.append(UploadedImage.objects.create(**image_data))
#         return uploaded_images