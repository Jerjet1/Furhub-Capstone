from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Auth Views
from FurhubApi.views.authViews import (
    RegisterView, LoginView, VerifyEmailView, ResendCodeView, 
    CheckEmailExist, ForgotPasswordView, VerifyCodeView, 
    ResetPasswordView, ChangePasswordView
)

# User Views
from FurhubApi.views.userView import AllUserView, BaseUserUpdateView, PetOwnerUpdateView, PetBoardingUpdateView

# Image Upload Views
from FurhubApi.views.imageUploadView import ProfileUploadView, ProviderDocumentView

# Booking Views
from FurhubApi.views.BookingView import PendingBookingBoardingView, RequestBookingView, PetOwnerBookingView, ApprovingBookingView, DecliningBookingView

# Pre-registration Views
from FurhubApi.views.PreRegistrationViews import (
    ProviderApplicationView, ProviderApplicationListView, 
    ApprovedProviderApplicationView, RejectProviderApplicationView,
    ProviderRegistrationView, ResendRegistrationView
)
from rest_framework.routers import DefaultRouter



urlpatterns = [
    # JWT Auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Users
    path('users/register/', RegisterView.as_view(), name='register'),# for Pet Owner Registration
    path('users/pre-register/', ProviderApplicationView.as_view(), name='pre-register'), # Provider pre-registration
    path('users/provider/register/<str:token>/', ProviderRegistrationView.as_view(), name="provider-registration"),  #Provider Registration
    path('users/check-email/', CheckEmailExist.as_view(), name='check_email'),
    path('users/resend-link/', ResendRegistrationView.as_view(), name='resend-link'),

    path('users/login/', LoginView.as_view(), name='login'),
    path('users/verify/', VerifyEmailView.as_view(), name='verify_email'),
    path('users/resend-code/', ResendCodeView.as_view(), name='resend_email'),
    path('users/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('users/verify-code/', VerifyCodeView.as_view(), name='verify-code'),
    path('users/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('users/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('users/documents_upload/', ProviderDocumentView.as_view(), name='documents_upload'),

    # Profile & Details
    path('users/profile/', ProfileUploadView.as_view(), name='profile_picture'),
    path('users/account-details/', BaseUserUpdateView.as_view(), name='account-details'),
    path('users/pet-owner-details/', PetOwnerUpdateView.as_view(), name="pet-owner-details"),
    path('users/pet-boarding-details/', PetBoardingUpdateView.as_view(), name='pet-boarding-details'),

    # Bookings
    path('boarding/list_bookings/', PendingBookingBoardingView.as_view(),name='list_bookings'),
    path('boarding/approve_booking/<int:booking_id>/', ApprovingBookingView.as_view(), name='approve_booking'),
    path('boarding/decline_booking/<int:booking_id>/', DecliningBookingView.as_view(), name='decline_booking'),
    path('owner/request_booking/', RequestBookingView.as_view(),name='request_booking'),
    path('owner/booking_details/', PetOwnerBookingView.as_view(), name="booking_details"),

    # Admin
    path('administrator/pending_applications/', ProviderApplicationListView.as_view(), name='pending_applications'),
    path('administrator/provider_applications/approve/<int:application_id>/', ApprovedProviderApplicationView.as_view(), name="approved_applications"),
    path('administrator/provider_applications/reject/<int:application_id>/', RejectProviderApplicationView.as_view(), name="reject_applications"),
    path('administrator/all_users/', AllUserView.as_view(), name='all_users'),
]
