from django.urls import path
from FurhubApi.views.authViews import (RegisterView, LoginView, VerifyEmailView, 
                    ResendCodeView,CheckEmailExist, UploadImageView, ForgotPasswordView, VerifyCodeView, ResetPasswordView)
from FurhubApi.views.userView import ServiceView, PendingProviders
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('users/register/', RegisterView.as_view(), name='register'),
    path('users/check-email', CheckEmailExist.as_view(), name='check_email'),

    path('users/login/', LoginView.as_view(), name='login'),
    path('users/verify/', VerifyEmailView.as_view(), name='verify_email'),
    path('users/resend-code/', ResendCodeView.as_view(), name='resend_email'),
    path('users/image_upload/', UploadImageView.as_view(), name='image_upload'),

    path('users/service_list/', ServiceView.as_view(), name='service_list'),
    
    path('users/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('users/verify-code/', VerifyCodeView.as_view(), name='verify-code'),
    path('users/reset-password/', ResetPasswordView.as_view(), name='reset-password'),

    # path('admin/pending_pet_walker/', PendingPetWalker.as_view(), name='pet_walker'),
    # path('admin/pending_pet_boarding/', PendingPetBoarding.as_view(), name='pet_boarding'),
    path('admin/pending_providers/', PendingProviders.as_view(), name='pending_providers')
]