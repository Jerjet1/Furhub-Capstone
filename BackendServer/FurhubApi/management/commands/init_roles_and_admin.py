from django.core.management.base import BaseCommand
from django.db import transaction
from FurhubApi.models import Roles, Users, User_roles
from dotenv import load_dotenv
import os

class Command(BaseCommand):
    help = "Initialize default roles and create an Admin account"

    def handle(self, *args, **options):
        roles = ["Admin", "Walker", "Boarding", "Owner"]

        with transaction.atomic():
            # Create roles if not exist
            role_objects = {}
            for role_name in roles:
                role, created = Roles.objects.get_or_create(role_name=role_name)
                role_objects[role_name] = role
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Created role: {role_name}"))
                else:
                    self.stdout.write(self.style.WARNING(f"Role already exists: {role_name}"))

            # Create admin account if not exists
            admin_email = os.getenv('ADMIN_EMAIL')
            admin_password = os.getenv('ADMIN_PASSWORD')  # ⚠️ Change to env var in production!

            if not Users.objects.filter(email=admin_email).exists():
                admin_user = Users.objects.create_superuser(
                    email=admin_email,
                    password=admin_password,
                    first_name="Super",
                    last_name="Admin",
                    phone_no="0000000000",
                    is_verified=True
                )
                User_roles.objects.create(user=admin_user, role=role_objects["Admin"])
                self.stdout.write(self.style.SUCCESS(f"Created Admin account: {admin_email}"))
            else:
                self.stdout.write(self.style.WARNING("Admin account already exists."))

        self.stdout.write(self.style.SUCCESS("Initialization completed successfully."))
