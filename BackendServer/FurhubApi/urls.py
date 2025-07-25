from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (RegisterView, LoginView, VerifyEmailView, 
                    ResendCodeView,CheckEmailExist, UploadImageView, ServiceView, PendingPetBoarding, PendingPetWalker,  ChatRoomViewSet, ChatMessageViewSet, get_or_create_room)
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

router = DefaultRouter()
router.register(r'chatrooms', ChatRoomViewSet, basename='chatroom')
router.register(r'messages', ChatMessageViewSet, basename='chatmessage')

urlpatterns = [
    #JWT token for login
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/register/', RegisterView.as_view(), name='register'),
    path('users/check-email', CheckEmailExist.as_view(), name='check_email'),
    path('users/login/', LoginView.as_view(), name='login'),
    path('users/verify/', VerifyEmailView.as_view(), name='verify_email'),
    path('users/resend-code/', ResendCodeView.as_view(), name='resend_email'),
    path('users/image_upload/', UploadImageView.as_view(), name='image_upload'),
    path('users/service_list/', ServiceView.as_view(), name='service_list'),
    
    path('admin/pending_pet_walker/', PendingPetWalker.as_view(), name='pet_walker'),
    path('admin/pending_pet_boarding/', PendingPetBoarding.as_view(), name='pet_boarding'),
   
    path('', include(router.urls)),  # ✅ Use viewset routing
    path('chatroom/get_or_create/', get_or_create_room, name='get_or_create_room'),

]