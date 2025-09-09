from .paypal_client import get_paypal_access_token
from django.conf import settings
import requests

def create_subscriptions(plan_id):
    url = f"{settings.PAYPAL_BASE_URL}/v1/billing/subscriptions"
    token = get_paypal_access_token()
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
    }

    data = {
        "plan_id": plan_id,
    }

    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()

    return response.json()