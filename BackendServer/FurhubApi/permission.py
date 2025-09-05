# permissions.py
from rest_framework.permissions import BasePermission
from .models import Admin, User_roles, Roles

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