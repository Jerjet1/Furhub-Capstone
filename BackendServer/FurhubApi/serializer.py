from rest_framework import serializers
from .models import Users

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
        
class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)
    class Meta:
        model = Users
        fields = ['first_name', 'last_name', 'phone_no', 'email', 'password', 'confirm_password']
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
        validated_data.pop('confirm_password')
        user = Users.objects.create_user(**validated_data)
        return user