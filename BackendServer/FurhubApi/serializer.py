from rest_framework import serializers
from .models import Users, Roles, User_roles, PetOwner, PetWalker,Admin, PetBoarding, UploadedImage, Service,ChatRoom, ChatMessage
from django.utils import timezone

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
        
class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True)
    class Meta:
        model = Users
        fields = ['first_name', 'last_name', 'phone_no', 'email', 'password', 'confirm_password', 'role']
        extra_kwargs = {'password': {'write_only': True}}

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({'password': 'Password does not match.'})
        return data
    
    def validate_email(self, value):
        if Users.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email is alreay in use.')
        return value
    
    def create(self, validated_data):
        role_name = validated_data.pop('role')
        validated_data.pop('confirm_password')

        #Create user
        user = Users.objects.create_user(**validated_data)
        #Assigned role
        role = Roles.objects.get(role_name = role_name)

        if role.role_name == 'Walker':
            PetWalker.objects.create(user = user)
        if role.role_name == 'Boarding':
            PetBoarding.objects.create(user = user)
        if role.role_name == 'Admin':
            Admin.objects.create(user = user)
        if role.role_name == 'Owner':
            PetOwner.objects.create(user = user)

        User_roles.objects.create(user = user, role = role)
        return user
    
class EmailVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get("email")
        code = data.get("code")

        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        if user.is_verified:
            raise serializers.ValidationError("Account already verified.")

        if user.verification_code != code:
            raise serializers.ValidationError("Invalid verification code.")

        if timezone.now() > user.code_expiry:
            raise serializers.ValidationError("Verification code has expired.")

        return data

    def save(self):
        email = self.validated_data["email"]
        user = Users.objects.get(email=email)
        user.is_verified = True
        user.verification_code = None  # clear used code
        user.code_expiry = None
        user.save()
        return user
    
class UploadImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['user', 'image', 'category', 'label', 'uploaded_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ['user_id', 'first_name', 'last_name', 'email', 'phone_no']

class PetWalkerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    uploaded_images = serializers.SerializerMethodField()
    class Meta:
        model = PetWalker
        fields = ['user', 'availability', 'status', 'uploaded_images']

    def get_upload_images(self, obj):
        images = UploadedImage.objects.filter(user = obj.user, category='walker_requirements')
        return UploadImageSerializer(images, many=True).data
    
class PetBoardingSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    uploaded_images = serializers.SerializerMethodField()
    class Meta:
        model = PetBoarding
        fields = ['user', 'hotel_name', 'availability', 'status', 'uploaded_images']
    
    def get_uploaded_images(self, obj):
        images = UploadedImage.objects.filter(user = obj.user, category='boarding_requirements')
        return UploadImageSerializer(images, many=True).data

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [ 'service_id','service_name']


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = '__all__'


# class BulkUploadImageSerializer(serializers.Serializer):
#     images = UploadImageSerializer(many=True)

#     def create(self, validated_data):
#         images_data = validated_data.pop('images')
#         uploaded_images = []
#         for image_data in images_data:
#             uploaded_images.append(UploadedImage.objects.create(**image_data))
#         return uploaded_images