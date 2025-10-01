from django.conf import settings
from django.db.models import Case, When, QuerySet, ProtectedError
from django.utils.translation import gettext as _
from elasticsearch import Elasticsearch
from rest_framework.exceptions import ValidationError
from rest_framework.mixins import DestroyModelMixin
from rest_framework.pagination import LimitOffsetPagination
from rest_framework_elasticsearch import es_views, es_filters


class DestroyProtectedModelMixin(DestroyModelMixin):
    """
    Returns a validation error instead of a 500 error for protected deletes
    """

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except ProtectedError:
            raise ValidationError(
                {"detail": [_("Erase is not possible, delete related entities first")]}
            )
