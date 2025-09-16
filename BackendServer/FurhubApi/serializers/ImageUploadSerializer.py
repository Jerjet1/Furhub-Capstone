from rest_framework import serializers
from FurhubApi.models import UploadedImage

class UploadImageSerializer(serializers.ModelSerializer):

    # image = serializers.ImageField(use_url = True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = UploadedImage
        fields = ['user','image', 'category', 'label', 'uploaded_at']
        extra_kwargs = {
            "user": {"required": False}  # 🔑 don’t force it
        }

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image:
            # This ensures the URL works both on local network and ngrok
            url = request.build_absolute_uri(obj.image.url)
            print(f"Generated image URL: {url}")  # 👈 Check this in your console
            return url
            # return request.build_absolute_uri(obj.image.url)
        return None

# class BulkUploadImageSerializer(serializers.Serializer):
#     images = UploadImageSerializer(many=True)

#     def create(self, validated_data):
#         images_data = validated_data.pop('images')
#         uploaded_images = []
#         for image_data in images_data:
#             uploaded_images.append(UploadedImage.objects.create(**image_data))
#         return uploaded_images