from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from FurhubApi.payments.paypal_orders import create_order, capture_order
from FurhubApi.payments.paypal_payouts import create_payout
from FurhubApi.payments.paypal_refund import refund_payment
from FurhubApi.payments.paypal_subscription import create_subscriptions
from FurhubApi.payments.paypal_webhooks import handle_webhook
from FurhubApi.serializers.PaymentSerializer import PaymentCreateSerializer
from FurhubApi.models import Payment, Booking
from rest_framework.permissions import IsAuthenticated


class PayPalCreateOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            booking_id = request.data.get("booking_id")
            amount = request.data.get("amount")
            payment_type = request.data.get("payment_type", "full")

            order = create_order(amount)

            booking = Booking.objects.get(booking_id=booking_id)
            payment = Payment.objects.create(
                booking=booking,
                amount=amount,
                payment_type=payment_type,
                payment_method="paypal",
                status="pending"
            )

            serializer = PaymentCreateSerializer(payment)
            return Response({"paypal_order": order, "payment": serializer.data}, status=status.HTTP_201_CREATED)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not Found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class PaypalCaptureOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            order_id = request.data.get("order_id")
            payment_id = request.data.get("payment_id")

            capture = capture_order(order_id)

            payment = Payment.objects.get(payment_id=payment_id)
            payment.status = 'completed'
            payment.save()
            serializer = PaymentCreateSerializer(payment)
            
            return Response({
                "capture": capture, 
                "payment": serializer.data}, status=status.HTTP_200_OK)
        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Pet owner
class PayPalRefundPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            capture_id = request.data.get("capture_id")
            amount = request.data.get("amount")
            refund = refund_payment(capture_id, amount)
            return Response({"refund": refund}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
#Admin/Walker or Boarding    
class PayPalPayoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            receiver_email = request.data.get("receiver_email")
            amount = request.data.get("amount")
            payout = create_payout(receiver_email, amount)

            return Response({"payout": payout}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Pet owner Subscribing / Pet boarding
class PayPalCreateSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            plan_id = request.data.get("plan_id")
            subscription = create_subscriptions(plan_id)
            return Response({"subscription": subscription}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Webhook paypal notifications
@method_decorator(csrf_exempt, name='dispatch')
class PayPalWebhookView(APIView):
    def post(self, request):
        try:
            event = request.data
            handle_webhook(request, event)
            return Response({"status": "ok"})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
