from .base import *  # noqa

from .base import config,  INSTALLED_APPS

# GENERAL
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#debug
DEBUG = True
# https://docs.djangoproject.com/en/dev/ref/settings/#secret-key
SECRET_KEY = config(
    "DJANGO_SECRET_KEY",
    default="Ye6cecVf3LY2l3cdIPU5eTwabInrm1ZKy7iaNHy5sFUGI5VwuV1wrHi1nxy0p89N",
)
# https://docs.djangoproject.com/en/dev/ref/settings/#allowed-hosts
ALLOWED_HOSTS = [
    "localhost",  # noqa
    "0.0.0.0",  # noqa
    "127.0.0.1",  # noqa
    "192.168.2.10",  # noqa
    "192.168.1.22",  # noqa
    "10.2.2.13",  # noqa
    "10.2.4.120",  # noqa
    "10.4.5.47",  # noqa
    "10.2.2.6",  # noqa
    "192.168.2.16",  # noqa
    "192.168.2.45",  # noqa
    "10.2.2.32",  # noqa
    "*"  # noqa
]

# MIDDLEWARES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/topics/http/middleware/
# MIDDLEWARE += [ 'middleware.oam.OAMSimulator' ]

# TESTS
# ------------------------------------------------------------------------------
TEST_RUNNER = "django.test.runner.DiscoverRunner"

# CACHES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#caches
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": config("REDIS_URL", default="redis://"),
        "TIMEOUT": None,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            # Mimicing memcache behavior.
            # http://niwinz.github.io/django-redis/latest/#_memcached_exceptions_behavior
            "IGNORE_EXCEPTIONS": True,
        },
    },
    "redis": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": config("REDIS_URL", default="redis://"),
        "TIMEOUT": None,
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
            # Mimicing memcache behavior.
            # http://niwinz.github.io/django-redis/latest/#_memcached_exceptions_behavior
            "IGNORE_EXCEPTIONS": True,
        },
    },
}

# TEMPLATES
# ------------------------------------------------------------------------------
# https://docs.djangoproject.com/en/dev/ref/settings/#templates
# TEMPLATES[0]['OPTIONS']['debug'] = DEBUG  # noqa F405

# django-debug-toolbar
# ------------------------------------------------------------------------------
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#prerequisites
# INSTALLED_APPS += ['debug_toolbar']  # noqa F405
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#middleware
# MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']  # noqa F405
# https://django-debug-toolbar.readthedocs.io/en/latest/configuration.html#debug-toolbar-config
# DEBUG_TOOLBAR_CONFIG = {
#     'DISABLE_PANELS': [
#         'debug_toolbar.panels.redirects.RedirectsPanel',
#     ],
#     'SHOW_TEMPLATE_CONTEXT': True,
# }
# https://django-debug-toolbar.readthedocs.io/en/latest/installation.html#internal-ips
INTERNAL_IPS = ["127.0.0.1", "10.0.2.2"]
if config("USE_DOCKER", default='yes') == "yes":
    import socket

    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS += [ip[:-1] + "1" for ip in ips]

# django-extensions
# ------------------------------------------------------------------------------
# https://django-extensions.readthedocs.io/en/latest/installation_instructions.html#configuration
INSTALLED_APPS += ["django_extensions"]  # noqa F405

# Celery
# ------------------------------------------------------------------------------
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#task-always-eager
CELERY_TASK_ALWAYS_EAGER = False
# http://docs.celeryproject.org/en/latest/userguide/configuration.html#task-eager-propagates
CELERY_TASK_EAGER_PROPAGATES = False

# IDP Simulator
# ------------------------------------------------------------------------------
# ADMIN
IDP_ACCESS_TOKEN = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlpMdGZteXhfWllaS0xjbjBvbExVX1Z0V0NMalNDOVItdkc5MUNYRUJRaTAifQ.eyJleHAiOjE3MzI3MDA5MzYsImlhdCI6MTczMjcwMDYzNiwiYXV0aF90aW1lIjoxNzMyNzAwNjMyLCJqdGkiOiI1Njg0MDkzZC1jNGVhLTRlZjItOTU0Mi1mODdkY2I5MTdkNWMiLCJpc3MiOiJodHRwczovL2lkcC1pbnQuYWp1bnRhbWVudC5iY24vYXV0aC9yZWFsbXMvY29ycCIsInN1YiI6IjVhZjliMjNiLTJjNmMtNDU2Mi1hNzEwLWI2MzIyNGZlMzA0NyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImdvY29tLS1zcGEtLWZyb250Iiwic2Vzc2lvbl9zdGF0ZSI6ImZkYjQ4ZWYxLTNlZjctNDQyZC1iYTg1LTQ0ZTI4YTcxMjI2OCIsInJlc291cmNlX2FjY2VzcyI6eyJnb2NvbS0tYXBpLS1nb2NvbS0tYmFjayI6eyJyb2xlcyI6WyJhZG1pbiJdfX0sInNjb3BlIjoib3BlbmlkIGltaSBnb2NvbS0tc3BhLS1mcm9udCBnb2NvbS0tYXBpLS1nb2NvbS0tYmFjayIsInNpZCI6ImZkYjQ4ZWYxLTNlZjctNDQyZC1iYTg1LTQ0ZTI4YTcxMjI2OCIsImRpdiI6Ikluc3QuIE11bmkuIGTCtEluZm9ybcOgdGljYSIsInRpcHVzVXN1YXJpIjoiVDQiLCJkaXNwbGF5TmFtZSI6IkNhc3RybyBHdWVycmVybywgSnVhbiBNaWd1ZWwiLCJnaXZlbk5hbWUiOiJKdWFuIE1pZ3VlbCIsImRlcGFydG1lbnROdW1iZXIiOiI4MDI2ODM1IiwiZGl2TnVtYmVyIjoiOTAwMiIsInNuIjoiQ2FzdHJvIEd1ZXJyZXJvIiwiZGVwYXJ0bWVudCI6IkRlcGFydGFtZW50IGRlIENhbmFscyBEaWdpdGFscyIsInVzZXIiOiJiMjczMDc1IiwiZW1haWwiOiJqdWFuLmNhc3Ryb0BuYXphcmllcy5jb20ifQ.NgDgt9mYvwsF59J3cjt61Jojr2xUWWAO26FfDn8oQIQTx-v0NsbKUCRUS4ZXw-a7-9a_iAmByud1lQhl34y9LxsJllW-9Y9yO3ZMnAdHhTZErXVKf-ybSbRQVQ9MmjWO8xLd_wdh3Rjouqau1jwMjgmwvCKGpkJ8zcGPBpTeouJmUrTZGONTEaKfcowJ2AMrCui2WfkqFOjSNFEIH2D6YGRRtpGK46zhI9pnpzLgbfFziakyInn7H7UbUBR7ZUmSwJGuK6LLIeJvjt3ZA0Jc9Q_7V2mpbo0A7p3o-RzF7XLICTt-Z6iH5l4xasLUl7V0UPbzJ3KbTmXeSR9CCSut7Q"
# MANAGER
# IDP_ACCESS_TOKEN = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlpMdGZteXhfWllaS0xjbjBvbExVX1Z0V0NMalNDOVItdkc5MUNYRUJRaTAifQ.eyJleHAiOjE3MzI3MDA5MzYsImlhdCI6MTczMjcwMDYzNiwiYXV0aF90aW1lIjoxNzMyNzAwNjMyLCJqdGkiOiI1Njg0MDkzZC1jNGVhLTRlZjItOTU0Mi1mODdkY2I5MTdkNWMiLCJpc3MiOiJodHRwczovL2lkcC1pbnQuYWp1bnRhbWVudC5iY24vYXV0aC9yZWFsbXMvY29ycCIsInN1YiI6IjVhZjliMjNiLTJjNmMtNDU2Mi1hNzEwLWI2MzIyNGZlMzA0NyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImdvY29tLS1zcGEtLWZyb250Iiwic2Vzc2lvbl9zdGF0ZSI6ImZkYjQ4ZWYxLTNlZjctNDQyZC1iYTg1LTQ0ZTI4YTcxMjI2OCIsInJlc291cmNlX2FjY2VzcyI6eyJnb2NvbS0tYXBpLS1nb2NvbS0tYmFjayI6eyJyb2xlcyI6WyJtYW5hZ2VyIl19fSwic2NvcGUiOiJvcGVuaWQgaW1pIGdvY29tLS1zcGEtLWZyb250IGdvY29tLS1hcGktLWdvY29tLS1iYWNrIiwic2lkIjoiZmRiNDhlZjEtM2VmNy00NDJkLWJhODUtNDRlMjhhNzEyMjY4IiwiZGl2IjoiSW5zdC4gTXVuaS4gZMK0SW5mb3Jtw6B0aWNhIiwidGlwdXNVc3VhcmkiOiJUNCIsImRpc3BsYXlOYW1lIjoiQ2FzdHJvIEd1ZXJyZXJvLCBKdWFuIE1pZ3VlbCIsImdpdmVuTmFtZSI6Ikp1YW4gTWlndWVsIiwiZGVwYXJ0bWVudE51bWJlciI6IjgwMjY4MzUiLCJkaXZOdW1iZXIiOiI5MDAyIiwic24iOiJDYXN0cm8gR3VlcnJlcm8iLCJkZXBhcnRtZW50IjoiRGVwYXJ0YW1lbnQgZGUgQ2FuYWxzIERpZ2l0YWxzIiwidXNlciI6ImIyNzMwNzUiLCJlbWFpbCI6Imp1YW4uY2FzdHJvQG5hemFyaWVzLmNvbSJ9.XVeEJkcmwj4qA0vlMKZxfWW-TlX4SRY8FDRdgm3svC5I5hwITByOP7pPuvEfkBPLAZfXcbxJgUhs5DD3M6qyIPD_7hbZJeiWN1rK5nad_yFagup6RWmBYsa9OQe96sERawFHD4MlhDkoGGP-9q29nL19rWmOoT3TFe-ogKeH67MLnEZydTlF9ULtbIIKgXL4hC20UW8YVCyZRSbOIzbvMD2vgihXZio1qq5871SzYHV6_G3VQ8foX9miKz3BQj7_CaZowY1k5z6e3LFKA0MPJj8d3LUWd4277gNc0eudDHM49GrwAZApqfPqn95jMmhBu0KxXkNpQ0nlig1ur10EYg"
# BASIC
# IDP_ACCESS_TOKEN = "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlpMdGZteXhfWllaS0xjbjBvbExVX1Z0V0NMalNDOVItdkc5MUNYRUJRaTAifQ.eyJleHAiOjE3MzI3MDA5MzYsImlhdCI6MTczMjcwMDYzNiwiYXV0aF90aW1lIjoxNzMyNzAwNjMyLCJqdGkiOiI1Njg0MDkzZC1jNGVhLTRlZjItOTU0Mi1mODdkY2I5MTdkNWMiLCJpc3MiOiJodHRwczovL2lkcC1pbnQuYWp1bnRhbWVudC5iY24vYXV0aC9yZWFsbXMvY29ycCIsInN1YiI6IjVhZjliMjNiLTJjNmMtNDU2Mi1hNzEwLWI2MzIyNGZlMzA0NyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImdvY29tLS1zcGEtLWZyb250Iiwic2Vzc2lvbl9zdGF0ZSI6ImZkYjQ4ZWYxLTNlZjctNDQyZC1iYTg1LTQ0ZTI4YTcxMjI2OCIsInJlc291cmNlX2FjY2VzcyI6eyJnb2NvbS0tYXBpLS1nb2NvbS0tYmFjayI6eyJyb2xlcyI6W119fSwic2NvcGUiOiJvcGVuaWQgaW1pIGdvY29tLS1zcGEtLWZyb250IGdvY29tLS1hcGktLWdvY29tLS1iYWNrIiwic2lkIjoiZmRiNDhlZjEtM2VmNy00NDJkLWJhODUtNDRlMjhhNzEyMjY4IiwiZGl2IjoiSW5zdC4gTXVuaS4gZMK0SW5mb3Jtw6B0aWNhIiwidGlwdXNVc3VhcmkiOiJUMyIsImRpc3BsYXlOYW1lIjoiQ2FzdHJvIEd1ZXJyZXJvLCBKdWFuIE1pZ3VlbCIsImdpdmVuTmFtZSI6Ikp1YW4gTWlndWVsIiwiZGVwYXJ0bWVudE51bWJlciI6IjgwMjY4MzUiLCJkaXZOdW1iZXIiOiI5MDAyIiwic24iOiJDYXN0cm8gR3VlcnJlcm8iLCJkZXBhcnRtZW50IjoiRGVwYXJ0YW1lbnQgZGUgQ2FuYWxzIERpZ2l0YWxzIiwidXNlciI6ImIyNzMwNzUiLCJlbWFpbCI6Imp1YW4uY2FzdHJvQG5hemFyaWVzLmNvbSJ9.OvhAJqz88Z22Y5CpuhCzNwnByRxAtjMoNJFLab5FItiJ1fqRRbIGunHiKjmOJqK8JZH0_M7Me0VH6WbJ22afIxxW-NnRw05pCkZQFVPg3slkBxg2J99TvpNlvo18lItYtaPMckNxzAmVO7SAYjfnX_9edPusZcjrl8WjITXFBAc8HQkxV-IOfIayqSUS-6uGUxeJUSa76pZq2zUffc-rMAs020bUpxh9CIGe4PgwHBWRuXioGrRXrbNNPnvzEj_qa2G3o9-3UkS6uxvDxHbhXxfdsv5zDsmkWeLYV_asWh6sY9P_RqHhXwQwEPuuUn5r1QqlXjC2jcj5h6QTyGsiFA"

# YASG swagger generator
# ------------------------------------------------------------------------------
SWAGGER_SETTINGS = {
    "DEFAULT_AUTO_SCHEMA_CLASS": "main.swagger.IMISwaggerAutoSchema",
    "DEFAULT_FIELD_INSPECTORS": [
        'drf_yasg.inspectors.CamelCaseJSONFilter',
        'drf_yasg.inspectors.ReferencingSerializerInspector',
        'drf_yasg.inspectors.RelatedFieldInspector',
        'drf_yasg.inspectors.ChoiceFieldInspector',
        'drf_yasg.inspectors.FileFieldInspector',
        'drf_yasg.inspectors.DictFieldInspector',
        'drf_yasg.inspectors.HiddenFieldInspector',
        'drf_yasg.inspectors.RecursiveFieldInspector',
        'drf_yasg.inspectors.SerializerMethodFieldInspector',
        'drf_yasg.inspectors.SimpleFieldInspector',
        'drf_yasg.inspectors.StringDefaultFieldInspector',
    ]
}

# STORAGES (no AWS for staticfiles in development)
# ------------------------------------------------------------------------------
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
