from django.db import models
from django.contrib.gis.db import models as gis_models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
# Create your models here.


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('the Email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)
    
class Users(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_no = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    date_field = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()
    
    @property
    def id(self):
        return self.user_id

    def __str__(self):
        return f'{self.email}\n{self.first_name}\n{self.last_name}'
    
    class Meta:
        db_table = 'users'

class Roles(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=50)
    class Meta:
        db_table = 'roles'

class User_roles(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    role = models.ForeignKey(Roles, on_delete=models.CASCADE)
    class Meta:
        db_table = 'user_roles'

class User_logs(models.Model):
    log_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    ip_address = models.GenericIPAddressField()
    date_field = models.DateTimeField(auto_now_add=True)
    class Meta:
        db_table = 'user_logs'

class Province(models.Model):
    province_id = models.AutoField(primary_key=True)
    province_name = models.CharField(max_length=100)
    class Meta:
        db_table = 'province'
class City(models.Model):
    city_id = models.AutoField(primary_key=True)
    province = models.ForeignKey(Province, on_delete=models.CASCADE)
    city_name = models.CharField(max_length=100)
    class Meta:
        db_table = 'city'

class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE)
    barangay = models.CharField(max_length=255, blank=True, null=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    street = models.CharField(max_length=255)
    coordinates = gis_models.PointField(geography=True, blank=True, null=True)
    class Meta:
        db_table = 'location'

class PetOwner(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    emergency_no = models.CharField(max_length=15)
    bio = models.TextField(blank=True)

    class Meta:
        db_table = 'pet_owner'

class PetWalker(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    availability = models.CharField(max_length=255)

    class Meta:
        db_table = 'pet_walker'

class PetBoarding(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    hotel_name = models.CharField(max_length=255)
    availability = models.CharField(max_length=255)

    class Meta:
        db_table = 'pet_boarding'

class Admin(models.Model):
    ADMIN_CHOICE = [('Admin', 'Admin'), ('Staff', 'Staff')]

    user = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    role_title = models.CharField(max_length=50, choices=ADMIN_CHOICE)
    is_active = models.BooleanField(default=True)
    class Meta:
        db_table = 'admin'

