from rest_framework import serializers
from FurhubApi.models import Users, PetWalker, PetBoarding, UploadedImage, Service
from .authSerializer import UploadImageSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user_id', 'first_name', 'last_name', 'email', 'phone_no']

class PetWalkerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    uploaded_images = serializers.SerializerMethodField()
    role_applied = serializers.SerializerMethodField()
    class Meta:
        model = PetWalker
        fields = ['user', 'availability', 'status', 'uploaded_images', 'role_applied']

    def get_uploaded_images(self, obj):
        images = UploadedImage.objects.filter(user = obj.user, category='walker_requirements')
        return UploadImageSerializer(images, many=True).data
    
    def get_role_applied(self, obj):
        return "Pet Walker"
    
class PetBoardingSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    uploaded_images = serializers.SerializerMethodField()
    class Meta:
        model = PetBoarding
        fields = ['user', 'hotel_name', 'availability', 'status', 'uploaded_images', 'role_applied']
    
    def get_uploaded_images(self, obj):
        images = UploadedImage.objects.filter(user = obj.user, category='boarding_requirements')
        return UploadImageSerializer(images, many=True).data
    
    def get_role_applied(self, obj):
        return "Pet Boarding"

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [ 'service_id','service_name']

# class BulkUploadImageSerializer(serializers.Serializer):
#     images = UploadImageSerializer(many=True)

#     def create(self, validated_data):
#         images_data = validated_data.pop('images')
#         uploaded_images = []
#         for image_data in images_data:
#             uploaded_images.append(UploadedImage.objects.create(**image_data))
#         return uploaded_images