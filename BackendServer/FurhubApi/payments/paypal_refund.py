from .paypal_client import get_paypal_access_token
from django.conf import settings
import requests

def refund_payment(capture_id, amount, currency="PHP"):
   url = f'{settings.PAYPAL_BASE_URL}/v2/payments/captures/{capture_id}/refund'
   token = get_paypal_access_token()
   headers = {
      "Content-Type": "application/json",
      "Authorization": f"Bearer {token}",
   }

   data = {}
   if amount is not None:
        data = {"amount": {"value": f"{amount:.2f}", "currency_code": currency}}
   response = requests.post(url, json=data, headers=headers)
   response.raise_for_status()

   return response.json()