# permissions.py

from rest_framework.permissions import BasePermission
from .models import Admin, User_roles, Roles

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        user = request.user

        # Check if user exists and is authenticated
        if not user or not user.is_authenticated:
            return False

        # Option A: Check your Admin table for active admin/staff
        is_admin_model = Admin.objects.filter(user=user, is_active=True).exists()
        
        # Option B: Check if user has role 'Admin' in your roles table
        admin_role = Roles.objects.filter(role_name='Admin').first()
        has_admin_role = False
        if admin_role:
            has_admin_role = User_roles.objects.filter(user=user, role=admin_role).exists()

        # Allow if either is true
        return is_admin_model or has_admin_role
