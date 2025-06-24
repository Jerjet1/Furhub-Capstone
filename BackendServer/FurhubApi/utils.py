from django.core.mail import send_mail
from django.core.mail import EmailMessage
from BackendServer import settings
from .models import Users
def send_verification_email(user):
    code = Users.generate_verification_code(user)
    send_mail(
        subject="Your Verification Code",
        message=f"Your 6-digit verification code is: {code}",
        from_email="noreply@example.com",
        recipient_list=[user.email],
        fail_silently=False,
    )
    # email = EmailMessage(
    #     subject="Your Verification Code",
    #     body=f"""
    #     <h2>Your verification code</h2>
    #     <p>Code: <strong>{code}</strong></p>
    #     <p>Expires in 4 minutes</p>
    #     """,
    #     from_email=settings.DEFAULT_FROM_EMAIL,
    #     to=[user.email],
    # )
    # email.content_subtype = "html"  # Main content is now text/html
    # email.send()
    

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split('')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip