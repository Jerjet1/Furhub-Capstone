from rest_framework import serializers
from .models import Users, Roles, User_roles, PetOwner, PetWalker,Admin, PetBoarding, UploadedImage, Service, Message, Conversation
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


class MessageSerializer(serializers.ModelSerializer):
    conversation_id = serializers.IntegerField(source='conversation.conversation_id', read_only=True)
    # sender_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Message
        fields = ('message_id', 'conversation_id', 'sender_id', 'content', 'sent_at', 'is_read')
        read_only_fields = ('message_id', 'conversation_id', 'sender_id', 'sent_at', 'is_read')


class ConversationSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    last_sent_at = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()
    other_user_name = serializers.SerializerMethodField()
    other_user_id = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ('conversation_id', 'user1_id', 'user2_id', 'last_message', 'last_sent_at', 'unread_count', 'other_user_name', 'other_user_id')

    def get_last_message(self, obj: Conversation):
        last = obj.messages.order_by('-sent_at').first()
        return last.content if last else None

    def get_last_sent_at(self, obj: Conversation):
        last = obj.messages.order_by('-sent_at').first()
        return last.sent_at.isoformat() if last else None

    def get_unread_count(self, obj: Conversation):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return 0
        return obj.messages.filter(is_read=False).exclude(sender=request.user).count()

    def get_other_user_name(self, obj: Conversation):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        
        # Return the name of the user who is not the current user
        if obj.user1_id == request.user.id:
            return f"{obj.user2.first_name} {obj.user2.last_name}"
        else:
            return f"{obj.user1.first_name} {obj.user1.last_name}"

    def get_other_user_id(self, obj: Conversation):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        
        # Return the ID of the user who is not the current user
        if obj.user1_id == request.user.id:
            return obj.user2_id
        else:
            return obj.user1_id

# class BulkUploadImageSerializer(serializers.Serializer):
#     images = UploadImageSerializer(many=True)

#     def create(self, validated_data):
#         images_data = validated_data.pop('images')
#         uploaded_images = []
#         for image_data in images_data:
#             uploaded_images.append(UploadedImage.objects.create(**image_data))
#         return uploaded_images
# FurhubApi/serializers/MessageSerializer.py
