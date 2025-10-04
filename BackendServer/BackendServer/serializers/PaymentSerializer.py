from rest_framework import serializers
from FurhubApi.models import Payment, TransactionLogs

class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['booking', 'amount', 'payment_type', 'payment_method']
