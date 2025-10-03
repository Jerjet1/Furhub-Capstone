from rest_framework import serializers
from FurhubApi.models import Users, Roles, User_roles, PetOwner, PetWalker, PetBoarding, ProviderApplication
from django.utils import timezone
from FurhubApi.utils import send_verification_email

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
        
class RegisterSerializer(serializers.ModelSerializer): #Pet Owner Serializer
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
        # Check if email already exists in Users table (active accounts)
        if Users.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email is already registered. Please use a different email or login.')
        
        # Check for non-rejected provider applications
        active_applications = ProviderApplication.objects.filter(
            email=value
        ).exclude(
            status='rejected'  # Allow rejected applications to register
        )
        
        if active_applications.exists():
            # Get the latest application for better error message
            latest_application = active_applications.latest('applied_at')
            
            if latest_application.status == 'approved':
                if latest_application.user:
                    raise serializers.ValidationError(
                        'This email is already registered as a service provider. '
                        'Please login to your provider account.'
                    )
                else:
                    raise serializers.ValidationError(
                        'This email has an approved service provider application. '
                        'Please check your email for the registration link to complete your provider account.'
                    )
                    
            elif latest_application.status == 'pending':
                applied_date = latest_application.applied_at.strftime('%B %d, %Y')
                raise serializers.ValidationError(
                    f'This email has a pending service provider application (submitted on {applied_date}). '
                    'Please wait for application review or use a different email for pet owner registration.'
                )
        
        return value
    
    def create(self, validated_data):
        role_name = validated_data.pop('role')
        validated_data.pop('confirm_password')

        #Create user
        user = Users.objects.create_user(**validated_data)
        #Assigned role
        role = Roles.objects.get(role_name = role_name)

        # if role.role_name == 'Admin':
        #     Admin.objects.create(user = user)
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

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not Users.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email does not exist.")
        return value
    
    def save(self):
        email = self.validated_data["email"]
        user = Users.objects.get(email=email)
        send_verification_email(user)
        user.save()

class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get("email")
        verification_code = data.get("code")

        try:
            user = Users.objects.get(email=email)
        except Users.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")

        if user.verification_code != verification_code:
            raise serializers.ValidationError("Invalid verification code.")
        return data

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def save(self):
        email = self.validated_data["email"]
        new_password = self.validated_data["new_password"]
        user = Users.objects.get(email=email)
        user.set_password(new_password)
        user.verification_code = None
        user.code_expiry = None
        user.save()

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate_(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match.")
        return data