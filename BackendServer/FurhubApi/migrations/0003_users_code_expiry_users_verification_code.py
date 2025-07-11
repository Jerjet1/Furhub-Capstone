# Generated by Django 5.2.1 on 2025-06-23 11:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('FurhubApi', '0002_user_roles_unique_user_role'),
    ]

    operations = [
        migrations.AddField(
            model_name='users',
            name='code_expiry',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='users',
            name='verification_code',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
    ]
