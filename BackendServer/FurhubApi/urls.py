from django.urls import path
from .views import RegisterView, LoginView
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)
<<<<<<< Updated upstream
=======
from rest_framework.routers import DefaultRouter
from FurhubApi.views.communityViews import PostViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'community/posts', PostViewSet, basename='post')
router.register(r'community/comments', CommentViewSet, basename='comment')


>>>>>>> Stashed changes
urlpatterns = [
    #JWT token for login
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/register/', RegisterView.as_view(), name='register'),
    path('users/login/', LoginView.as_view(), name='login'),
<<<<<<< Updated upstream
]
=======
    path('users/verify/', VerifyEmailView.as_view(), name='verify_email'),
    path('users/resend-code/', ResendCodeView.as_view(), name='resend_email'),
    path('users/image_upload/', UploadImageView.as_view(), name='image_upload'),

    # Profile Picture Users
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
    # path('administrator/pending_providers/', PendingProviders.as_view(), name='pending_providers'),
    path('administrator/all_users/', AllUserView.as_view(), name='all_users')
]

urlpatterns += router.urls
>>>>>>> Stashed changes
