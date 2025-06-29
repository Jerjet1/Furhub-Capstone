# Generated by Django 5.2.1 on 2025-06-13 17:41

import django.contrib.gis.db.models.fields
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Users',
            fields=[
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('user_id', models.AutoField(primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('phone_no', models.CharField(max_length=15)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_verified', models.BooleanField(default=False)),
                ('date_field', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'users',
            },
        ),
        migrations.CreateModel(
            name='City',
            fields=[
                ('city_id', models.AutoField(primary_key=True, serialize=False)),
                ('city_name', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'city',
            },
        ),
        migrations.CreateModel(
            name='Province',
            fields=[
                ('province_id', models.AutoField(primary_key=True, serialize=False)),
                ('province_name', models.CharField(max_length=100)),
            ],
            options={
                'db_table': 'province',
            },
        ),
        migrations.CreateModel(
            name='Roles',
            fields=[
                ('role_id', models.AutoField(primary_key=True, serialize=False)),
                ('role_name', models.CharField(max_length=50)),
            ],
            options={
                'db_table': 'roles',
            },
        ),
        migrations.CreateModel(
            name='Admin',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('role_title', models.CharField(choices=[('Admin', 'Admin'), ('Staff', 'Staff')], max_length=50)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'admin',
            },
        ),
        migrations.CreateModel(
            name='PetBoarding',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('hotel_name', models.CharField(max_length=255)),
                ('availability', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'pet_boarding',
            },
        ),
        migrations.CreateModel(
            name='PetOwner',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('emergency_no', models.CharField(max_length=15)),
                ('bio', models.TextField(blank=True)),
            ],
            options={
                'db_table': 'pet_owner',
            },
        ),
        migrations.CreateModel(
            name='PetWalker',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('availability', models.CharField(max_length=255)),
            ],
            options={
                'db_table': 'pet_walker',
            },
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('location_id', models.AutoField(primary_key=True, serialize=False)),
                ('barangay', models.CharField(blank=True, max_length=255)),
                ('street', models.CharField(max_length=255)),
                ('coordinates', django.contrib.gis.db.models.fields.PointField(blank=True, geography=True, null=True, srid=4326)),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FurhubApi.city')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'location',
            },
        ),
        migrations.AddField(
            model_name='city',
            name='province',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FurhubApi.province'),
        ),
        migrations.CreateModel(
            name='User_logs',
            fields=[
                ('log_id', models.AutoField(primary_key=True, serialize=False)),
                ('action', models.CharField(max_length=100)),
                ('ip_address', models.GenericIPAddressField()),
                ('date_field', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'user_logs',
            },
        ),
        migrations.CreateModel(
            name='User_roles',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='FurhubApi.roles')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'user_roles',
            },
        ),
    ]
