from .paypal_client import get_paypal_access_token
from django.conf import settings
import requests

def create_order(amount, currency='PHP'):
    url = f'{settings.PAYPAL_BASE_URL}/v2/checkout/orders'
    token = get_paypal_access_token()
    headers = {
        "Content-Type" : "application/json",
        "Authorization" : f"Bearer {token}",
    }

    data = {
        "intent" : "CAPTURE",
        "purchase_units" : [
            {"amount": {"currency_code" : currency, "value": f"{amount:.2f}"}}
        ]
    }

    response = requests.post(url, json=data, headers=headers)
    response.raise_for_status()
    return response.json()

def capture_order(order_id):
    url = f'{settings.PAYPAL_BASE_URL}/v2/checkout/orders/{order_id}/capture'
    token = get_paypal_access_token()
    headers = {
        "Content-Type" : "application/json",
        "Authorization" : f"Bearer {token}",
    }

    response = requests.post(url, headers=headers)
    response.raise_for_status()

    return response.json()