from django.urls import path, include
from rest_framework.routers import DefaultRouter
from FurhubApi.views.authViews import (
    RegisterView, LoginView, VerifyEmailView, ResendCodeView, CheckEmailExist, ForgotPasswordView, 
    VerifyCodeView, ResetPasswordView, ChangePasswordView
)
from FurhubApi.views.userView import (
    ServiceView, AllUserView, PendingPetBoarding, PendingPetWalker, BaseUserUpdateView, PetOwnerUpdateView
)
from FurhubApi.views.imageUploadView import UploadImageView, ProfileUploadView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from FurhubApi.views.Locationviews import  LocationViewSet
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from FurhubApi.views.communityviews import PostViewSet, CommentViewSet
from django.conf import settings
from django.conf.urls.static import static


router = DefaultRouter()
router.register("locations", LocationViewSet, basename="locations")
router.register('posts', PostViewSet)
router.register('comments', CommentViewSet)

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('users/register/', RegisterView.as_view(), name='register'),
    path('users/check-email/', CheckEmailExist.as_view(), name='check_email'),
    path('users/login/', LoginView.as_view(), name='login'),
    path('users/verify/', VerifyEmailView.as_view(), name='verify_email'),
    path('users/resend-code/', ResendCodeView.as_view(), name='resend_email'),
    path('users/image_upload/', UploadImageView.as_view(), name='image_upload'),
    path('users/profile/', ProfileUploadView.as_view(), name='profile_picture'),
    path('users/account-details/', BaseUserUpdateView.as_view(), name='account-details'),
    path('users/pet-owner-details/', PetOwnerUpdateView.as_view(), name="pet-owner-details"),
    path('users/service_list/', ServiceView.as_view(), name='service_list'),
    path('users/forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('users/verify-code/', VerifyCodeView.as_view(), name='verify-code'),
    path('users/reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('users/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('administrator/pending_pet_walker/', PendingPetWalker.as_view(), name='pet_walker'),
    path('administrator/pending_pet_boarding/', PendingPetBoarding.as_view(), name='pet_boarding'),
    path('administrator/all_users/', AllUserView.as_view(), name='all_users'),

# <-- Add this to include all your viewset routes
    path("", include(router.urls)),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
