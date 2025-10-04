from rest_framework import serializers
from FurhubApi.models import OperationalHours, BoardingRate, BoardingPolicy


class OperationalHourSerializer(serializers.ModelSerializer):

    class Meta:
        model = OperationalHours
        fields = ['day', 'open_time', 'close_time', 'is_open']

    def validate(self, data):
        if not data.get('day'):
            raise serializers.ValidationError({"day": "Day field is required"})
        return data

class BoardingRateSerializer(serializers.ModelSerializer):

    class Meta:
        model = BoardingRate
        fields = ['pet_boarding', 'hourly_rate', 'daily_rate', 'weekly_rate' ]

        read_only_fields = ['pet_boarding']
    
    def validate_hourly_rate(self, value):
        if value and value < 0:
            raise serializers.ValidationError("Hourly rate cannot be negative")
        return value
    
    def validate_daily_rate(self, value):
        if value and value < 0:
            raise serializers.ValidationError("Daily rate cannot be negative")
        return value
    
    def validate_weekly_rate(self, value):
        if value and value < 0:
            raise serializers.ValidationError("Weekly rate cannot be negative")
        return value

class BoardingPolicySerializer(serializers.ModelSerializer):

    class Meta:
        model = BoardingPolicy
        fields = ['pet_boarding', 'policy_type', 'description', 'fee', 'grace_period_minutes', 'active', 'last_edited']

        read_only_fields = ['pet_boarding']
