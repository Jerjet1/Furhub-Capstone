# permissions.py
from rest_framework.permissions import BasePermission
from .models import Admin, User_roles, Roles, Conversation

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        # Check authentication first
        if not user.is_authenticated:
            return False

        try:
            # Option A: Check Admin table (using user_id instead of id)
            is_admin_model = Admin.objects.filter(user__id=user.id, is_active=True).exists()
            
            # Option B: Check roles (explicitly use user_id)
            admin_role = Roles.objects.filter(role_name__iexact='admin').first()
            has_admin_role = User_roles.objects.filter(
                user__id=user.id, 
                role=admin_role
            ).exists() if admin_role else False

            return is_admin_model or has_admin_role
            
        except Exception as e:
            print(f"Permission check error: {str(e)}")  # Debugging
            return False


class IsOwnerOrWalker(BasePermission):
    """Allow only Pet Owner and Pet Walker to access the view."""
    def has_permission(self, request, view):
        user = request.user
        if not user or not user.is_authenticated:
            return False

        try:
            # Find roles of the user via join table
            roles = set(
                User_roles.objects.filter(user_id=user.id).values_list("role__role_name", flat=True)
            )
            return any(r.lower() in {"owner", "walker"} for r in roles)
        except Exception:
            return False


class IsConversationParticipant(BasePermission):
    """Object-level permission: user must be a participant in the conversation."""
    def has_object_permission(self, request, view, obj):
        # obj can be a Conversation or a Message (with .conversation)
        conversation = obj if isinstance(obj, Conversation) else getattr(obj, "conversation", None)
        if not conversation:
            return False
        return request.user and request.user.is_authenticated and (
            request.user.id in (conversation.user1_id, conversation.user2_id)
        )