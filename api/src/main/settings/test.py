"""
With these settings, tests run faster.
"""

from .base import *  # noqa
from .base import config  # noqa

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = False

# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = "Nkk3LDD1Kg24MFKkmbhq88eBvjAveeYoLFGnqrX2MYQusa1O6kSHZwjd9jVpfKI6"
# https://docs.djangoproject.com/en/dev/ref/settings/#test-runner

TEST_RUNNER = "core.test_runner.ESDiscoverRunner"

from .base import (config, db_url, INSTALLED_APPS)

POSTGRES_HOST = config("POSTGRES_HOST")
POSTGRES_PORT = config("POSTGRES_PORT")
POSTGRES_USER = config("POSTGRES_USER")
POSTGRES_PASSWORD = config("POSTGRES_PASSWORD")
DEFAULT_POSTGRES_URL = "postgresql://" + POSTGRES_USER + ":" + POSTGRES_PASSWORD + "@" + POSTGRES_HOST + ":" + POSTGRES_PORT + "/postgres"
DATABASES["default"] = config("DATABASE_URL", cast=db_url, default=DEFAULT_POSTGRES_URL)
DATABASES['default']['ENGINE'] = 'django.contrib.gis.db.backends.postgis'

# CACHES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "",
    }
}

# PASSWORDS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#password-hashers
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]

# TEMPLATES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#templates
TEMPLATES[0]["OPTIONS"]["debug"] = DEBUG  # noqa F405
TEMPLATES[0]["OPTIONS"]["loaders"] = [  # noqa F405
    (
        "django.template.loaders.cached.Loader",
        [
            "django.template.loaders.filesystem.Loader",
            "django.template.loaders.app_directories.Loader",
        ],
    )
]

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
# https://docs.djangoproject.com/en/dev/ref/settings/#email-host
EMAIL_HOST = "localhost"
# https://docs.djangoproject.com/en/dev/ref/settings/#email-port
EMAIL_PORT = 1025

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
        },
    },
}

IS_TEST = True
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "imiauth.middleware.IDPSimulatorMiddleware",
]
