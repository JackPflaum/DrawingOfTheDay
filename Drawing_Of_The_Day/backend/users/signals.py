from django.dispatch import receiver
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created
from django.core.mail import EmailMessage


# this signal is triggered when a reset password token is created
@receiver(reset_password_token_created)
def custom_reset_password_email(sender, instance, reset_password_token, user, request, *args, **kwargs):
    """customize reset_password_token_created by adding email with link to reset user password including token"""

    # create link to password reset and include reset token
    reset_link = instance.request.build_absolute_uri('https://localhost:3000/password-reset' + f'?token={reset_password_token.key}')

    # email content
    subject = 'Reset Your Password'
    message = f'''Forgot your Drawing Of The Day password?
    Click the link below to reset your password:
    {reset_link}
    If you didn't request a reset, then you can safely ignore this email.'''
    from_email = 'drawingoftheday@gmail.com'
    to_email = [user.email]

    # compose email and send
    email = EmailMessage(subject, message, from_email, to_email)
    email.send()