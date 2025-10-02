from rest_framework import serializers
from FurhubApi.models import Users, PetWalker, PetBoarding, Service, PetOwner

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['id', 'first_name', 'last_name', 'email', 'phone_no']

class PetOwnerUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetOwner
        fields = ['emergency_no', 'bio']

class PetBoardingUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetBoarding
        fields = '__all__'

class PetWalkerUpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PetWalker
        fields = '__all__'

class AdminUpdateProfileSerializer(serializers.ModelSerializer):
    pass

# class PetWalkerSerializer(serializers.ModelSerializer):
#     user = UserSerializer()
#     uploaded_images = serializers.SerializerMethodField()
#     # role_applied = serializers.SerializerMethodField()
#     class Meta:
#         model = PetWalker
#         fields = ['user', 'availability', 'status', 'uploaded_images']

#     def get_uploaded_images(self, obj):
#         images = UploadedImage.objects.filter(user = obj.user, category='walker_requirements')
#         return UploadImageSerializer(images, many=True).data
    
#     # def get_role_applied(self, obj):
#     #     return "Pet Walker"
    
# class PetBoardingSerializer(serializers.ModelSerializer):
#     user = UserSerializer()
#     uploaded_images = serializers.SerializerMethodField()
#     class Meta:
#         model = PetBoarding
#         # fields = ['user', 'hotel_name', 'availability', 'status', 'uploaded_images']
#         fields = ['user', 'hotel_name', 'availability', 'status', 'uploaded_images']
    
#     def get_uploaded_images(self, obj):
#         images = UploadedImage.objects.filter(user = obj.user, category='boarding_requirements')
#         return UploadImageSerializer(images, many=True).data
    
    # def get_role_applied(self, obj):
    #     return "Pet Boarding"

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [ 'service_id','service_name']
