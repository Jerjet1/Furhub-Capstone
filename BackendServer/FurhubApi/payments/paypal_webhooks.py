import requests
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from FurhubApi.models import Payment, TransactionLogs, Ledger, UserBalance, ProviderService, Payout
from .paypal_client import get_paypal_access_token

def verify_webhook(request, body):
    token = get_paypal_access_token()
    url = f"{settings.PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature"
    data = {
        "transmission_id": request.headers.get("Paypal-Transmission-Id"),
        "transmission_time": request.headers.get("Paypal-Transmission-Time"),
        "cert_url": request.headers.get("Paypal-Cert-Url"),
        "auth_algo": request.headers.get("Paypal-Auth-Algo"),
        "transmission_sig": request.headers.get("Paypal-Transmission-Sig"),
        "webhook_id": settings.PAYPAL_WEBHOOK_ID,
        "webhook_event": body
    }
    resp = requests.post(url, json=data, headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    })
    resp.raise_for_status()
    return resp.json().get("verification_status") == "SUCCESS"

def handle_webhook(request, body):
    if not verify_webhook(request, body):
        return False
    event_type = body.get("event_type")
    resource = body.get("resource", {})

    event_type = body.get("event_type")
    resource = body.get("resource", {})

    with transaction.atomic():
        if event_type == "PAYMENT.CAPTURE.COMPLETED":
            _handle_payment_completed(resource)
        
        elif event_type == "PAYMENT.CAPTURE.REFUNDED":
            _handle_payment_refunded(resource)
            
        elif event_type == "PAYMENT.PAYOUTS-ITEM.SUCCEEDED":
            _handle_payout_succeeded(resource)
            
        elif event_type == "PAYMENT.PAYOUTS-ITEM.FAILED":
            _handle_payout_failed(resource)
    
    return True

def _handle_payment_completed(resource):
    
    capture_id = resource.body("id")
    amount = float(resource.get("amount",{}).get("value", 0))
    currency = resource.get("amount", {}).get("currency_code")

    payment = (Payment.objects.filter(capture_id=capture_id).first() or 
               Payment.objects.filter(order_id=resource.get('supplementary_data', {}).get('related_ids', {}).get('order_id')).first())
    
    if not payment:
        # Log error: payment not found
        return
    
    # Update payment details
    payment.capture_id = capture_id
    payment.currency_code = currency
    payment.status = "completed"
    payment.save()

    # Get or create user balance for the provider
    provider_service = payment.booking.provider
    user_balance, created = UserBalance.objects.get_or_create(
        provider=provider_service,
        defaults={'available_balance': 0, 'pending_balance': 0, 'total_earning': 0}
    )

    # Calculate new balances
    user_balance.available_balance += amount
    user_balance.total_earning += amount
    user_balance.save()

    # Create ledger entry
    latest_ledger = Ledger.objects.filter(provider=provider_service).last()
    previous_balance = latest_ledger.running_balance if latest_ledger else 0
    new_balance = previous_balance + amount

    Ledger.objects.create(
        provider=provider_service,
        entry_type="sale",
        amount=amount,
        booking=payment.booking,
        payment=payment,
        running_balance=new_balance
    )

    # Create transaction log
    TransactionLogs.objects.create(
        payment=payment,
        action="payment_capture_completed",
        external_id=capture_id,
        meta=resource,
        remarks=f"Payment captured. Provider balance increased by {amount} {currency}"
    )

def _handle_payment_refunded(resource):
    
    capture_id = resource.get("id")
    refund_amount = float(resource.get("amount", {}).get("value", 0))

    payment = Payment.objects.filter(capture_id=capture_id).first()
    if not payment:
        return
    
    payment.status = "refunded"
    payment.save()

    provider_service = payment.booking.provider
    user_balance = UserBalance.objects.get(provider=provider_service)

    # Update balances
    user_balance.available_balance -= refund_amount
    user_balance.total_earning -= refund_amount
    user_balance.save()

    # Create ledger entry
    latest_ledger = Ledger.objects.filter(provider=provider_service).last()
    previous_balance = latest_ledger.running_balance if latest_ledger else 0
    new_balance = previous_balance - refund_amount

    Ledger.objects.create(
        provider=provider_service,
        entry_type="refund",  # You might want to add this to ENTRY_TYPE choices
        amount=refund_amount,
        booking=payment.booking,
        payment=payment,
        running_balance=new_balance
    )

    TransactionLogs.objects.create(
        payment=payment,
        action="payment_refunded",
        external_id=capture_id,
        meta=resource,
        remarks=f"Refund processed. Provider balance decreased by {refund_amount}"
    )

def _handle_payout_succeeded(resource):

    payout_item_id = resource.get("payout_item_id")
    payout_batch_id = resource.get("payout_batch_id")
    amount = float(resource.get("amount", {}).get("value", 0))

    # Find the payout record
    payout = Payout.objects.filter(payout_item_id=payout_item_id).first()
    if not payout:
        return
    
    payout.status = "completed"
    payout.completed_at = timezone.now()
    payout.save()

    provider_service = payout.provider
    user_balance = UserBalance.objects.get(provider=provider_service)

    # Update balance
    user_balance.available_balance -= amount
    user_balance.save()

    # Create ledger entry
    latest_ledger = Ledger.objects.filter(provider=provider_service).last()
    previous_balance = latest_ledger.running_balance if latest_ledger else 0
    new_balance = previous_balance - amount

    Ledger.objects.create(
        provider=provider_service,
        entry_type="payout",
        amount=amount,
        payout=payout,
        running_balance=new_balance
    )

    TransactionLogs.objects.create(
        payout=payout,
        action="payout_succeeded",
        external_id=payout_batch_id,
        meta=resource,
        remarks=f"Payout of {amount} successfully sent to provider"
    )

def _handle_payout_failed(resource):
    
    payout_item_id = resource.get("payout_item_id")
    failure_reason = resource.get("reason", "No reason provided")

    # 1. FIND THE PAYOUT RECORD
    payout = Payout.objects.filter(payout_item_id=payout_item_id).first()
    if not payout:
        # Log an error: we got a webhook for a payout we can't find!
        return
    
    # 2. UPDATE THE PAYOUT STATUS
    payout.status = "failed"
    payout.failure_reason = failure_reason
    payout.save()

    provider_service = payout.provider
    amount = payout.amount

    # 3. CRITICAL: REVERT THE BALANCE DEDUCTION (Add the amount back)
    # Check if the balance was already deducted when the payout was initiated
    try:
        user_balance = UserBalance.objects.get(provider=provider_service)
        user_balance.available_balance += amount  # Add back the failed payout amount
        user_balance.save()
    except UserBalance.DoesNotExist:
        # Handle error: provider balance record doesn't exist
        pass

    # 4. UPDATE THE LEDGER (Add a corrective entry)
    latest_ledger = Ledger.objects.filter(provider=provider_service).last()
    previous_balance = latest_ledger.running_balance if latest_ledger else 0
    new_balance = previous_balance + amount  # Increase balance due to failed payout

    Ledger.objects.create(
        provider=provider_service,
        entry_type="payout_reversal",  # You might need to add this type
        amount=amount,
        payout=payout,
        running_balance=new_balance,
        remarks=f"Payout failed. Amount returned to available balance. Reason: {failure_reason}"
    )

    # 5. CREATE TRANSACTION LOG FOR AUDITING
    TransactionLogs.objects.create(
        payout=payout,
        action="payout_failed",
        external_id=payout_item_id,
        meta=resource,
        remarks=f"Payout failed. {amount} was not sent. Reason: {failure_reason}"
    )