from rest_framework import serializers
from FurhubApi.models import UploadedImage, ProviderDocument
import imghdr

ALLOWED_EXTENSIONS = ["jpeg", "jpg", "png"]
ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"]

class UploadImageSerializer(serializers.ModelSerializer):

    # Accept file on write
    image = serializers.ImageField(write_only=True, required=True)
    # Return absolute URL on read
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UploadedImage
        fields = ['user', 'image', 'image_url', 'category', 'uploaded_at']
        extra_kwargs = {
            "user": {"required": False}  # don't force frontend to send user
        }

    def validate_image(self, value):
        # Check MIME type
        if value.content_type not in ALLOWED_MIME_TYPES:
            raise serializers.ValidationError("Only JPEG and PNG images are allowed.")

        # Double-check using imghdr (avoids spoofing with fake extensions)
        ext = imghdr.what(value.file)
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError("Invalid image format. Only JPEG/PNG allowed.")

        # Limit file size (e.g., 15 MB)
        max_size = 15 * 1024 * 1024  
        if value.size > max_size:
            raise serializers.ValidationError("Image size must be under 15MB.")

        return value
    
    def create(self, validated_data):
        # Pop the image from validated_data and create instance with remaining fields
        image = validated_data.pop('image', None)
        user = validated_data.pop('user', None)
        instance = UploadedImage.objects.create(user=user, **validated_data)
        if image:
            instance.image = image
            instance.save()
        return instance

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            # This ensures the URL works both on local network and ngrok
            url = request.build_absolute_uri(obj.image.url)
            # print(f"Generated image URL: {url}")  # 👈 Check this in your console
            return url
            # return request.build_absolute_uri(obj.image.url)
        return None

class ProviderDocumentSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(write_only=True, required=True)
    image_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ProviderDocument
        fields = ['application', 'document_type', 'image', 'image_url', 'uploaded_at']
        read_only_fields = ['uploaded_at']
    
    def validate_image(self, value):
        # Check MIME type
        if value.content_type not in ALLOWED_MIME_TYPES:
            raise serializers.ValidationError("Only JPEG and PNG images are allowed.")

        # Double-check using imghdr (avoids spoofing with fake extensions)
        ext = imghdr.what(value.file)
        if ext not in ALLOWED_EXTENSIONS:
            raise serializers.ValidationError("Invalid image format. Only JPEG/PNG allowed.")

        # Limit file size (e.g., 15 MB)
        max_size = 15 * 1024 * 1024  
        if value.size > max_size:
            raise serializers.ValidationError("Image size must be under 15MB.")

        return value
    
    def create(self, validated_data):
        image = validated_data.pop('image', None)
        instance = ProviderDocument.objects.create(**validated_data)
        if image:
            instance.image = image
            instance.save()
        return instance

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None

# class BulkUploadImageSerializer(serializers.Serializer):
#     images = UploadImageSerializer(many=True)

#     def create(self, validated_data):
#         images_data = validated_data.pop('images')
#         uploaded_images = []
#         for image_data in images_data:
#             uploaded_images.append(UploadedImage.objects.create(**image_data))
#         return uploaded_images