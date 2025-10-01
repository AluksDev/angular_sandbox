"""
Base settings to build other settings files upon.
"""

import os
from pathlib import Path

from decouple import config
from dj_database_url import parse as db_url

# fix elastic filters dependencies
# django.utils.encoding.force_text = force_str
# django.utils.translation.ugettext_lazy = gettext_lazy
# django.utils.six = six

ROOT_DIR = Path(__file__).parent  # (src/main/settings/base.py)
APPS_DIR = ROOT_DIR.parent.parent

ENV_API_BASE_URL = "services/sandbox/"

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = config("DJANGO_DEBUG", default=False, cast=bool)
# Local time zone. Choices are
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# though not all of them may be available with every OS.
# In Windows, this must be set to your system time zone.
TIME_ZONE = "Europe/Madrid"
# https://docs.djangoproject.com/en/dev/ref/settings/#language-code
LANGUAGE_CODE = "en-us"
# https://docs.djangoproject.com/en/dev/ref/settings/#site-id
SITE_ID = 1
# https://docs.djangoproject.com/en/dev/ref/settings/#use-i18n
USE_I18N = True
# https://docs.djangoproject.com/en/dev/ref/settings/#use-l10n
USE_L10N = True
# https://docs.djangoproject.com/en/dev/ref/settings/#use-tz
USE_TZ = True

# DATABASES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#databases

DATABASES = {"default": config("DATABASE_URL", cast=db_url, default='sqlite:///db.sqlite3')}
DATABASES["default"]["ATOMIC_REQUESTS"] = True

DATABASES['default']['TEST'] = {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': 'test.sqlite3',
    'SERIALIZE': False,
    'ATOMIC_REQUESTS': True,
}

# URLS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#root-urlconf
ROOT_URLCONF = "main.urls"
# https://docs.djangoproject.com/en/dev/ref/settings/#wsgi-application
WSGI_APPLICATION = "main.wsgi.application"

# APPS
# ------------------------------------------------------------------------------
DJANGO_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    # "django.contrib.sessions",
    "django.contrib.sites",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # "django.contrib.admin",
    "django.contrib.postgres",
    "django.contrib.gis",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    'rest_framework.authtoken',  # just for tests because we do not have access to imi auth there
    "django_filters",
    "drf_yasg",
    "health_check",
    "health_check.db",
    "health_check.cache",
    "health_check.storage",
    "health_check.contrib.celery"
]

LOCAL_APPS = [
    "authentication",
    "game",
]

HEALTH_CHECK = {
    'DISK_USAGE_MAX': 90,  # percent
    'MEMORY_MIN': 100,  # in MB
}

# https://docs.djangoproject.com/en/dev/ref/settings/#installed-apps
INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

# AUTHENTICATION
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#authentication-backends

AUTHENTICATION_BACKENDS = ["django.contrib.auth.backends.ModelBackend"]

# https://docs.djangoproject.com/en/dev/ref/settings/#auth-user-model

AUTH_USER_MODEL = "authentication.User"

# https://docs.djangoproject.com/en/dev/ref/settings/#login-redirect-url
# LOGIN_REDIRECT_URL = 'users:redirect'
# https://docs.djangoproject.com/en/dev/ref/settings/#login-url
# LOGIN_URL = 'account_login'

# PASSWORDS
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#password-hashers
PASSWORD_HASHERS = [
    # https://docs.djangoproject.com/en/dev/topics/auth/passwords/#using-argon2-with-django
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
    "django.contrib.auth.hashers.BCryptPasswordHasher",
]
# https://docs.djangoproject.com/en/dev/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# MIDDLEWARE
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#middleware
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
]

# STATIC
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#static-root
STATIC_ROOT = str(ROOT_DIR.joinpath("staticfiles"))
# https://docs.djangoproject.com/en/dev/ref/settings/#static-url
STATIC_URL = "/static/"
# https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#std:setting-STATICFILES_DIRS
STATICFILES_DIRS = [str(APPS_DIR.joinpath("static"))]
# https://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/#staticfiles-finders
STATICFILES_FINDERS = [
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
]

# MEDIA
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#media-root
MEDIA_ROOT = str(APPS_DIR.joinpath("media"))
# https://docs.djangoproject.com/en/dev/ref/settings/#media-url
MEDIA_URL = "/media/"

# TEMPLATES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#templates
TEMPLATES = [
    {
        # https://docs.djangoproject.com/en/dev/ref/settings/#std:setting-TEMPLATES-BACKEND
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # https://docs.djangoproject.com/en/dev/ref/settings/#template-dirs
        "DIRS": [str(APPS_DIR.joinpath("templates"))],
        "OPTIONS": {
            # https://docs.djangoproject.com/en/dev/ref/settings/#template-debug
            "debug": DEBUG,
            # https://docs.djangoproject.com/en/dev/ref/settings/#template-loaders
            # https://docs.djangoproject.com/en/dev/ref/templates/api/#loader-types
            "loaders": [
                "django.template.loaders.filesystem.Loader",
                "django.template.loaders.app_directories.Loader",
            ],
            # https://docs.djangoproject.com/en/dev/ref/settings/#template-context-processors
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.template.context_processors.i18n",
                "django.template.context_processors.media",
                "django.template.context_processors.static",
                "django.template.context_processors.tz",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]

# FIXTURES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#fixture-dirs
FIXTURE_DIRS = (str(APPS_DIR.joinpath("fixtures")),)

# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#email-backend
EMAIL_BACKEND = config(
    "DJANGO_EMAIL_BACKEND", default="django.core.mail.backends.smtp.EmailBackend"
)
# EMAIL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#default-from-email
DEFAULT_FROM_EMAIL = config("DJANGO_DEFAULT_FROM_EMAIL",
                            default="Aixo no es un joc <noreply@aixonoesunjoc.ajuntament.bcn>")
# https://docs.djangoproject.com/en/dev/ref/settings/#server-email
SERVER_EMAIL = config("DJANGO_SERVER_EMAIL", default=DEFAULT_FROM_EMAIL)
# https://docs.djangoproject.com/en/dev/ref/settings/#email-subject-prefix
EMAIL_SUBJECT_PREFIX = config("DJANGO_EMAIL_SUBJECT_PREFIX", default="[Aixo no es un joc]")
# https://docs.djangoproject.com/en/dev/ref/settings/#email-host
EMAIL_HOST = config("DJANGO_EMAIL_HOST", default='vs_smtp_exchange_imi.imi.bcn')
# https://docs.djangoproject.com/en/dev/ref/settings/#email-port
EMAIL_PORT = config("DJANGO_EMAIL_PORT", cast=int, default=25)
# https://docs.djangoproject.com/en/dev/ref/settings/#email-username
EMAIL_HOST_USER = config("DJANGO_EMAIL_HOST_USER", default="nobody@example.com")
# https://docs.djangoproject.com/en/dev/ref/settings/#email-password
EMAIL_HOST_PASSWORD = config("DJANGO_EMAIL_HOST_PASSWORD", default="xxxxx")
# https://docs.djangoproject.com/en/dev/ref/settings/#email-use-tls
EMAIL_USE_TLS = config("DJANGO_EMAIL_USE_TLS", cast=bool, default=False)

SMTP_CONFIG = {
    "default": {
        "host": EMAIL_HOST,
        "port": EMAIL_PORT,
        "username": EMAIL_HOST_USER,
        "password": EMAIL_HOST_PASSWORD,
        "use_tls": EMAIL_USE_TLS
    }
}

# ADMIN
# ------------------------------------------------------------------------------
# Django Admin URL.
ADMIN_URL = "admin/"
# https://docs.djangoproject.com/en/dev/ref/settings/#admins
ADMINS = []
# https://docs.djangoproject.com/en/dev/ref/settings/#managers
MANAGERS = ADMINS

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

# Celery
# ------------------------------------------------------------------------------
if USE_TZ:
    # http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-timezone
    CELERY_TIMEZONE = TIME_ZONE
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-broker_url
CELERY_BROKER_URL = config("REDIS_URL", default='redis://')
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-result_backend
CELERY_RESULT_BACKEND = CELERY_BROKER_URL
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-accept_content
CELERY_ACCEPT_CONTENT = ["json"]
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-task_serializer
CELERY_TASK_SERIALIZER = "json"
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-result_serializer
CELERY_RESULT_SERIALIZER = "json"
# https://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-worker_prefetch_multiplier
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-worker_pool_restarts
CELERY_WORKER_POOL_RESTARTS = True
# https://docs.celeryproject.org/en/latest/userguide/configuration.html#std:setting-task_acks_late
CELERY_TASK_ACKS_LATE = True
# https://docs.celeryproject.org/en/latest/userguide/configuration.html#broker-transport-options
CELERY_BROKER_TRANSPORT_OPTIONS = {'visibility_timeout': 3600}

CELERY_TASK_ROUTES = {
    # 'taskapp.tasks.async_update_es_record': {'queue': 'slow_queue'},
    'entity.tasks.async_update_entity_visibility': {'queue': 'slow_queue'},
    'entity.tasks.async_visibility_update_primary_filters': {'queue': 'slow_queue'},
    'entity.tasks.async_visibility_update_secondary_filters': {'queue': 'slow_queue'},
    'entity.tasks.async_visibility_update_target_views': {'queue': 'slow_queue'}
}

# OAM Simulator
# ------------------------------------------------------------------------------
X_IMI_ROLES = {
    "undefined": "missing define which role has access to this endpoint",
    "admin": "administrator can use this endpoint",
}

# IDP Simulator
# ------------------------------------------------------------------------------
IDP_ACCESS_TOKEN = config(
    "IDP_ACCESS_TOKEN", default=False
)

# Control-User Roles.
# ------------------------------------------------------------------------------

ADMINISTRATOR_ROLE_KEY = "admin"
ADMINISTRATOR_ROLE = {
    ADMINISTRATOR_ROLE_KEY: "administrator can use this endpoint"
}

MANAGER_ROLE_KEY = "manager"
MANAGER_ROLE = {
    MANAGER_ROLE_KEY: "Manager can use this endpoint"
}

# ------------------------------------------------------------------------------

DATE_INPUT_FORMATS = ['%Y-%m-%d', 'iso-8601']
DATETIME_INPUT_FORMATS = ['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601']

# Config rest framework
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.NamespaceVersioning",
    "DEFAULT_VERSION": "current",  # Should comment this line to generate a complete openapi json
    "DEFAULT_FILTER_BACKENDS": [
        "rest_framework.filters.SearchFilter",
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "TEST_REQUEST_DEFAULT_FORMAT": "json",
    "PAGE_SIZE": 10,
    "DATE_INPUT_FORMATS": ['%Y-%m-%dT%H:%M:%S.%fZ', 'iso-8601'],
    "DATETIME_INPUT_FORMATS": ['%Y-%m-%d', 'iso-8601'],
    "UPLOADED_FILES_USE_URL": False,
}

PHONENUMBER_DEFAULT_REGION = "ES"

# Translations
gettext = lambda s: s  # noqa: E731

LANGUAGES = (
    ("en", gettext("English")),
    ("ca", gettext("Catalan")),
    ("es", gettext("Spanish")),
    ("fr", gettext("French")),
)

# Folder to store translations
LOCALE_PATHS = (os.path.join(APPS_DIR, "locale"),)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {"class": "logging.StreamHandler"},
        "file": {"class": "logging.FileHandler", "filename": "elastic.log"},
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": os.getenv("DJANGO_LOG_LEVEL", "INFO"),
            "propagate": False,
        },
    },
}

# GDAL Configuration
DEFAULT_SRID = 25831

DOMAIN_NAME = config('DOMAIN_NAME', default="http://localhost:8000")
X_IBM_CLIENT_ID = config('X_IBM_CLIENT_ID', default="local")

IS_TEST = False

# IDP Config variables
IDP_API_MANAGER_URL = config("apiManagerBaseUrl", default=None)
