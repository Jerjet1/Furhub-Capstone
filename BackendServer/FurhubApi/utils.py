from django.utils import timezone
from django.core.mail import send_mail
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from .models import Users, ProviderApplication
import logging

logger = logging.getLogger(__name__)

def send_approval_email(application):
    """
    Send approval email with registration link
    """
    try:
        # Generate registration token if not exists
        if not application.registration_token or not application.is_token_valid():
            application.generate_registration_token()

        # print(application.registration_token)

        registration_url = f"http://localhost:5173/provider/registration/{application.registration_token}"
        # context = {
        #     'application': application,
        #     'registration': registration_url,
        #     'facility_name': application.facility_name or f"{application.first_name} {application.last_name}",
        #     'provider_type': application.get_provider_type_display(),
        # }
        
        subject = f"Your {application.get_provider_type_display()} Application Has Been Approved!"

        # html_message = render_to_string('emails/application_approved.html', context)
        # plain_message = strip_tags(html_message)
        # Simple text email for console testing
        message = f"""
        APPLICATION APPROVED!
        
        Dear {application.facility_name or f"{application.first_name} {application.last_name}"},
        
        Congratulations! Your {application.get_provider_type_display()} application has been approved.
        
        To complete your registration, click the link below:
        {registration_url}
        
        This link will expire in 7 days.
        
        Best regards,
        PetCare Team
        """
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[application.email],
            # html_message=html_message,
            fail_silently=False,
        )

        # Update application record
        application.email_sent = True
        application.email_sent_at = timezone.now()
        application.save()

        logger.info(f"Approval email sent to {application.email}")
        logger.info(f"📧 Registration URL: {registration_url}")
        return True

    except Exception as e:
        logger.error(f"Failed to send approval email to {application.email}: {str(e)}")
        return False
    
def send_rejection_email(application):
    """
    Send rejection email with reason
    """
    try:

        context = {
            'application': application,
            'facility_name': application.facility_name or f"{application.first_name} {application.last_name}",
            'provider_type': application.get_provider_type_display(),
            'reject_reason': application.reject_reason,
        }

        subject = f"Update on Your {application.get_provider_type_display()} Application"

        # Simple text email for console testing
        message = f"""
        APPLICATION UPDATE
        
        Dear {application.facility_name or f"{application.first_name} {application.last_name}"},
        
        Thank you for your interest in becoming a {application.get_provider_type_display()} with our platform.
        
        After careful review, we regret to inform you that your application has not been approved at this time.
        
        Reason: {application.reject_reason or 'Not provided'}
        
        You may reapply after addressing the concerns mentioned above.
        
        Best regards,
        PetCare Team
        """

        # html_message = render_to_string('emails/application_rejected.html', context)
        # plain_message = strip_tags(html_message)

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[application.email],
            # html_message=html_message,
            fail_silently=False,
        )

        # Update application record
        application.email_sent = True
        application.email_sent_at = timezone.now()
        application.save()

        logger.info(f"Rejection email sent to {application.email}")
        return True

    except Exception as e:
        logger.error(f"Failed to send rejection email to {application.email}: {str(e)}")
        return False

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
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip