from pathlib import Path
import os
from datetime import timedelta
import socket
from dotenv import load_dotenv

hostname = socket.gethostname()
local_ip = socket.gethostbyname(hostname)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR/'.env'))

PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv('PAYPAL_CLIENT_SECRET')
PAYPAL_BASE_URL = os.getenv('PAYPAL_BASE_URL', 'https://api-m.sandbox.paypal.com')
PAYPAL_WEBHOOK_ID = os.getenv('PAYPAL_WEBHOOK_ID')



# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-=9um0w6h1lt=epz-f8uhiqhj_+4r0o#no&cczzte5a!+!a58ku'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
# NGROK_DOMAIN = "osvaldo-gigantesque-expostulatingly.ngrok-free.app"
# ALLOWED_HOSTS = [NGROK_DOMAIN]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'FurhubApi',
    'rest_framework',
    'corsheaders',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS_ALLOWED_ORIGINS = ['http://localhost:5173', 'exp://192.168.1.3:8081']
ALLOWED_HOSTS = ["*"]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_ALL_ORIGINS = True
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:5173",     # vite
#     "http://127.0.0.1:5173",
#     "http://localhost:8081",     # expo web
#     "http://127.0.0.1:8081",
#     f"http://{local_ip}:8081",
# ]
# USE_X_FORWARDED_HOST = True  # 👈 Add this
# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    "ngrok-skip-browser-warning",
]

# EMAIL_BACKEND = 'django.core.mail.backends.filebased.EmailBackend'
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
EMAIL_FILE_PATH = '/tmp/django-emails'  # Folder where emails will be saved

# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'furhub.test.mail@gmail.com'  # The new email you created
# EMAIL_HOST_PASSWORD = 'viex akeq dzux ysck'    # The app password you generated
# DEFAULT_FROM_EMAIL = 'Furhub@gmail.com'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    'UPDATE_LAST_LOGIN': False,

    # Ensure these match your frontend
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
}

ROOT_URLCONF = 'BackendServer.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'BackendServer.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.contrib.gis.db.backends.postgis',
#         'NAME': 'furhubv2',
#         'USER': 'postgres',
#         'PASSWORD': '1190716',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }

DATABASES = {
    'default': {
        'ENGINE':'django.db.backends.postgresql',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': os.getenv('DATABASE_PORT')

    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'FurhubApi.Users'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'