from rest_framework import serializers
from FurhubApi.models import ProviderApplication
from .ImageUploadSerializer import ProviderDocumentSerializer


class WalkerApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderApplication
        fields = ["application_id","user", "provider_type", "email", "first_name", "last_name",]
        # fields = ["user", "provider_type", "first_name", "last_name", "location", "status"]
        extra_kwargs = {
            "user": {"required": False}  # 🔑 don’t force it
        }

    def validate(self, data):
        if data.get("provider_type") != "walker":
            raise serializers.ValidationError("Invalid provider type for this serializer")
        return data


class BoardingApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProviderApplication
        # fields = ["user", "provider_type", "facility_name", "location", "status"]
        fields = ["application_id","user", "provider_type", "email", "facility_name"]
        extra_kwargs = {
            "user": {"required": False}  # 🔑 don’t force it
        }

    def validate(self, data):
        if data.get("provider_type") != "boarding":
            raise serializers.ValidationError("Invalid provider type for this serializer")
        return data

class ProviderApplicationSerializer(serializers.ModelSerializer):
    documents = ProviderDocumentSerializer(many=True, read_only=True)
    provider_type_display = serializers.CharField(source="get_provider_type_display", read_only=True)
    class Meta:
        model = ProviderApplication
        # fields = ["application_id", "provider_type", "email", "first_name", "last_name", "facility_name", "location", "status", "documents", "applied_at"]
        fields = ["application_id", "provider_type","provider_type_display", 
                  "email", "first_name", "last_name", "facility_name", 
                  "status", "documents", "applied_at"]
        read_only_fields = ["application_id", "applied_at", "documents"]