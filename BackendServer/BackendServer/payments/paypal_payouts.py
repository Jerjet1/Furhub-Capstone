from .paypal_client import get_paypal_access_token
from django.conf import settings
import requests, uuid

def create_payout(receiver_email, amount, currency="PHP"):
    url = f"{settings.PAYPAL_BASE_URL}/v1/payments/payouts"
    token = get_paypal_access_token()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}"
    }

    data = {
        "sender_batch_header":{
            "sender_batch_id": str(uuid.uuid4()),
            "email_subject": "You have a payout!"
        },
        "items":[{
            "recipient_type": "EMAIL",
            "receiver": receiver_email,
            "amount": {"currency": currency, "value": str(amount)},
            "note": "Payment for complete service"
        }]
    }

    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()

    return response.json()