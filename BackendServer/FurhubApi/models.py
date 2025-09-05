from django.db import models
import random
from django.utils import timezone
from datetime import timedelta
from django.contrib.gis.db import models as gis_models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
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
    id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_no = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    code_expiry = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    date_field = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    objects = CustomUserManager()
    
    def generate_verification_code(self):
        code = f"{random.randint(100000,999999)}"
        self.verification_code = code
        self.code_expiry = timezone.now() + timedelta(minutes = 4)
        self.save()
        return code

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
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="roles")
    role = models.ForeignKey(Roles, on_delete=models.CASCADE, related_name="users")
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'role'], 
                name='unique_user_role'
            )
        ]
        db_table = 'user_roles'

class User_logs(models.Model):
    log_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="logs")
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
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name="cities")
    city_name = models.CharField(max_length=100)
    class Meta:
        db_table = 'city'

class Location(models.Model):
    location_id = models.AutoField(primary_key=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name="locations")
    barangay = models.CharField(max_length=255, blank=True, null=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name="locations")
    street = models.CharField(max_length=255)
    coordinates = gis_models.PointField(geography=True, blank=True, null=True)
    class Meta:
        db_table = 'location'

class PetOwner(models.Model):
    user = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    emergency_no = models.CharField(max_length=15, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'pet_owner'

class PetWalker(models.Model):

    STATUS_CHOICE = [("pending", "Pending") ,
                     ("approved", "Approved"), 
                     ("rejected", "Rejected")]

    user = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    availability = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=20,default="pending", choices=STATUS_CHOICE)

    class Meta:
        db_table = 'pet_walker'

class PetBoarding(models.Model):

    STATUS_CHOICE = [("pending", "Pending") ,
                     ("approved", "Approved"), 
                     ("rejected", "Rejected")]
    
    user = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    hotel_name = models.CharField(max_length=255, null=True, blank=True)
    availability = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=20,default="pending", choices=STATUS_CHOICE)

    class Meta:
        db_table = 'pet_boarding'

class Admin(models.Model):
    ADMIN_CHOICE = [('Admin', 'Admin'), ('Staff', 'Staff')]

    user = models.OneToOneField(Users, on_delete=models.CASCADE, primary_key=True)
    role_title = models.CharField(max_length=50, choices=ADMIN_CHOICE)
    is_active = models.BooleanField(default=True)
    class Meta:
        db_table = 'admin'

class UploadedImage(models.Model):
    CATEGORY_CHOICES = [
        ("profile_picture", "Profile Picture"),
        ("community_post", "Community Post"),
        ("walker_requirement", "Walker Requirement"),
        ("boarding_requirement", "Boarding Requirement"),
    ]

    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='uploads/')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    label = models.CharField(max_length=100, blank=True)  # e.g., "NBI Clearance", "Barangay Clearance"
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'uploaded_images'

class Service(models.Model):
    service_id = models.AutoField(primary_key=True)
    service_name = models.CharField(max_length=100)

    class Meta:
        db_table = 'service'

class ProviderService(models.Model):
    PROVIDER_TYPE_CHOICE = [
        ('walker', 'Pet Walker'),
        ('boarding', 'Pet Boarding')
    ]
    providerService_id = models.AutoField(primary_key=True)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    provider = models.ForeignKey(Users, on_delete=models.CASCADE)
    provider_type = models.CharField(max_length=15, choices=PROVIDER_TYPE_CHOICE)
    provider_rate = models.DecimalField(decimal_places=2, max_digits=10)

    class Meta:
        unique_together = ['service', 'provider', 'provider_type']
        db_table = 'provider_service'
class Booking(models.Model):
    STATUS_CHOICE = [("pending", "Pending"),
                     ("approved", "Approved"),
                     ("ongoing", "Ongoing"),
                     ("rejected", "Rejected")]
    
    booking_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(PetOwner, on_delete=models.CASCADE, related_name="bookings")
    provider = models.ForeignKey(ProviderService, on_delete=models.CASCADE, related_name="bookings")
    status = models.CharField(max_length=15, choices=STATUS_CHOICE, default="pending")
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'booking'

class Pet(models.Model):
    pet_id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(PetOwner, on_delete=models.CASCADE, related_name="pets")
    name = models.CharField(max_length=150)
    breed = models.CharField(max_length=150)
    age = models.IntegerField()
    size = models.IntegerField()
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'pet'

class Pet_Form(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="pet_forms")
    pet =  models.ForeignKey(Pet, on_delete=models.SET_NULL, related_name="forms",blank=True, null=True )
    welfare_note = models.TextField(max_length=200, blank=True, null=True)

    class Meta:
        db_table = 'pet_form'

class PetSchedule(models.Model):
    SERVICE_CHOICE = [("feeding", "Feeding"),
                      ("walking", "Walking")]
    
    pet_form = models.ForeignKey(Pet_Form, on_delete=models.CASCADE, related_name="schedules")
    schedule_type = models.CharField(max_length=20,choices=SERVICE_CHOICE)
    time = models.TimeField()  

    class Meta:
        db_table = 'pet_schedule'


