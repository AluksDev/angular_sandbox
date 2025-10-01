import base64
import copy
import importlib
from collections import OrderedDict
from uuid import UUID

import six
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage
from django.db.models import ProtectedError
from django.db.models.fields.reverse_related import ForeignObjectRel
from django.utils.translation import gettext as _
from drf_writable_nested import NestedCreateMixin, NestedUpdateMixin
from rest_framework import serializers
from rest_framework.fields import Field
from rest_framework.serializers import ListSerializer, ModelSerializer, Serializer
from rest_framework.settings import api_settings


def split_levels(fields):
    """
    Convert dot-notation such as ['a', 'a.b', 'a.d', 'c'] into
    current-level fields ['a', 'c'] and next-level fields
    {'a': ['b', 'd']}.
    """

    first_level_fields = []
    next_level_fields = {}

    if not fields:
        return first_level_fields, next_level_fields

    if not isinstance(fields, list):
        fields = [a.strip() for a in fields.split(",") if a.strip()]
    for e in fields:
        if "." in e:
            first_level, next_level = e.split(".", 1)
            first_level_fields.append(first_level)
            next_level_fields.setdefault(first_level, []).append(next_level)
        else:
            first_level_fields.append(e)

    first_level_fields = list(set(first_level_fields))
    return first_level_fields, next_level_fields


class DynamicModelSerializer(ModelSerializer):
    """
        A ModelSerializer that takes additional arguments for
        "fields" and "include" in order to
        control which fields are displayed, and whether to replace simple values with
        complex, nested serializations.
    """

    expandable_fields = None
    expand_field_names = None
    passed = None
    global_passed = None

    def __init__(self, *args, **kwargs):

        if self.expandable_fields is None:
            self.expandable_fields = {}
        if self.expand_field_names is None:
            self.expand_field_names = {}
        if self.passed is None:
            self.passed = {
                "expand": kwargs.pop("expand", None),
                "fields": kwargs.pop("fields", None),
            }

        self.expanded_fields = []

        super().__init__(*args, **kwargs)

    def to_representation(self, instance):
        for field in self.fields:
            if isinstance(self.fields[field], ListSerializer):
                self.expandable_fields[field] = (
                    self.fields[field].child.__class__,
                    {
                        "source": self.fields[field].source,
                        "many": True,
                        "read_only": self.fields[field].read_only,
                        "write_only": self.fields[field].write_only,
                    },
                )
            elif isinstance(self.fields[field], ModelSerializer) or isinstance(
                    self.fields[field], RecursiveSerializer
            ):
                params = {
                    "source": self.fields[field].source,
                    "many": False,
                    "read_only": self.fields[field].read_only,
                    "write_only": self.fields[field].write_only,
                }
                try:
                    params["child"] = self.fields[field].child
                except Exception:
                    pass

                self.expandable_fields[field] = (self.fields[field].__class__, params)
            else:
                if field in self.expandable_fields:
                    del self.expandable_fields[field]

        expand = self._get_expand_input(self.passed)
        fields = self._get_fields_input(self.passed)
        self.expand_field_names, next_expand_field_names = split_levels(expand)
        sparse_field_names, next_sparse_field_names = split_levels(fields)

        for field in sparse_field_names:
            if field in self.expandable_fields.keys():
                self.expand_field_names = list(self.expand_field_names) + [field]

        expandable_fields_names = self._get_expandable_names(sparse_field_names)
        if "~all" in self.expand_field_names:
            self.expand_field_names = self.expandable_fields.keys()

        for field in self.expandable_fields:
            if field in self.fields:
                if (
                        isinstance(self.fields[field], ModelSerializer)
                        or isinstance(self.fields[field], ListSerializer)  # noqa: W503
                        or isinstance(self.fields[field], RecursiveSerializer)  # noqa: W503
                ):
                    del self.fields[field]

        for name in self.expand_field_names:
            if name not in expandable_fields_names:
                continue

            self.expanded_fields.append(name)
            self.fields[name] = self._make_expanded_field_serializer(
                name, next_expand_field_names, next_sparse_field_names
            )

        return super().to_representation(instance)

    def _make_expanded_field_serializer(self, name, nested_expands, nested_includes):
        """
        Returns an instance of the dynamically created nested serializer.
        """
        field_options = self.expandable_fields[name]
        serializer_class = field_options[0]
        if type(serializer_class) == str:
            serializer_class = self._import_serializer_class(serializer_class)

        serializer_settings = copy.deepcopy(field_options[1])
        serializer_settings["context"] = self.context

        if issubclass(serializer_class, DynamicModelSerializer) or issubclass(
                serializer_class, RecursiveSerializer
        ):
            serializer_settings["expand"] = "none"
            if name in nested_expands:
                serializer_settings["expand"] = nested_expands[name]

            serializer_settings["fields"] = "~all"
            if name in nested_includes:
                serializer_settings["fields"] = nested_includes[name]

        if serializer_settings.get("source") == name:
            del serializer_settings["source"]
        return serializer_class(**serializer_settings)

    def _import_serializer_class(self, location):
        """
        Resolves a dot-notation string to serializer class.
        <app>.<SerializerName> will automatically be interpreted as:
        <app>.serializers.<SerializerName>
        """
        pieces = location.split(".")
        class_name = pieces.pop()
        if pieces[len(pieces) - 1] != "serializers":
            pieces.append("serializers")

        module = importlib.import_module(".".join(pieces))
        return getattr(module, class_name)

    def _get_expandable_names(self, sparse_field_names):
        if not sparse_field_names:
            return self.expandable_fields.keys()

        allowed_field_names = set(sparse_field_names)
        if "~all" in allowed_field_names:
            allowed_field_names = set(self.fields.keys())
        field_names = set(self.fields.keys())
        expandable_field_names = set(self.expandable_fields.keys())

        for field_name in field_names - allowed_field_names:
            self.fields.pop(field_name)

        return list(expandable_field_names & allowed_field_names)

    @property
    def _can_access_request(self):
        """
        Can access current request object if all are true
        - The serializer is the root.
        - A request context was passed in.
        """
        if self.parent and not isinstance(self.parent, ListSerializer):
            return False

        if not hasattr(self, "context") or not self.context.get("request", None):
            return False

        return True

    def _get_fields_input(self, passed_settings):
        value = passed_settings.get("fields")

        if value:
            return value

        if not self._can_access_request:
            return None

        fields = self.context["request"].query_params.get("fields")
        return fields.split(",") if fields else None

    def _get_expand_input(self, passed_settings):
        """
            If not expandable (ViewSet list method set this to false),
            check to see if there are any fields that we are forcing
            to be expanded (from permit_list_expands).
        """
        value = passed_settings.get("expand")

        if value:
            return value

        if not self._can_access_request:
            return None

        if self.context.get("expandable") is False:
            force_expand = self.context.get("force_expand", [])
            if len(force_expand) > 0:
                return force_expand

            return None

        expand = self.context["request"].query_params.get("expand")
        return expand.split(",") if expand else None


class RecursiveSerializer(Serializer):
    def __init__(self, *args, **kwargs):
        self.passed = {
            "expand": kwargs.pop("expand", ""),
            "fields": kwargs.pop("fields", "~all"),
        }

        super().__init__(*args, **kwargs)

    def to_representation(self, value):
        many = False
        if isinstance(value, list):
            many = True

        if isinstance(self.parent, ListSerializer):
            if isinstance(self.parent.parent, DynamicModelSerializer):
                serializer = self.parent.parent.__class__(
                    value,
                    many=many,
                    context=self.context,
                    fields=self.passed["fields"],
                    expand=self.passed["expand"],
                )
            else:
                serializer = self.parent.parent.__class__(
                    value, many=many, context=self.context
                )
        else:
            if isinstance(self.parent, DynamicModelSerializer):
                serializer = self.parent.__class__(
                    value,
                    context=self.context,
                    fields=self.passed["fields"],
                    expand=self.passed["expand"],
                )
            else:
                serializer = self.parent.__class__(value, context=self.context)

        return serializer.data


class Base64FileField(Field):
    default_error_messages = {
        'required': _('No file was submitted.'),
        'invalid': _('The submitted data was not a file. Check the encoding type on the form.'),
        'no_name': _('No filename could be determined.'),
        'empty': _('The submitted file is empty.'),
        'max_length': _('Ensure this filename has at most {max_length} characters (it has {length}).'),
    }

    def __init__(self, header='', *args, **kwargs):
        self.max_length = kwargs.pop('max_length', None)
        self.allow_empty_file = kwargs.pop('allow_empty_file', False)
        if 'use_url' in kwargs:
            self.use_url = kwargs.pop('use_url')
        self.header = header
        super().__init__(*args, **kwargs)

    def to_internal_value(self, data):
        if isinstance(data, six.string_types) and data.startswith(self.header):
            format, imgstr = data.split(';base64,')
            ext = format.split('/')[-1]
            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
        try:
            # `UploadedFile` objects should have name and size attributes.
            file_name = data.name
            file_size = data.size
        except AttributeError:
            self.fail('invalid')

        if not file_name:
            self.fail('no_name')
        if not self.allow_empty_file and not file_size:
            self.fail('empty')
        if self.max_length and len(file_name) > self.max_length:
            self.fail('max_length', max_length=self.max_length, length=len(file_name))

        return data

    def to_representation(self, value):
        if not value:
            return None

        use_url = getattr(self, 'use_url', api_settings.UPLOADED_FILES_USE_URL)

        if use_url:
            if not getattr(value, 'url', None):
                # If the file has not been saved it may not have a URL.
                return None
            url = value.url
            request = self.context.get('request', None)
            if request is not None:
                return request.build_absolute_uri(url)
            return url

        return value.name


class FileSystemStorageReferenceFileField(Field):
    default_error_messages = {
        'required': _('No file was submitted.'),
        'invalid': _('Not a valid uuid.'),
        'no_name': _('No filename could be determined.'),
        'empty': _('The submitted file is empty.'),
        'max_length': _('Ensure this filename has at most {max_length} characters (it has {length}).'),
        'not_found': _("File '{filepath}' not found."),
    }

    def __init__(self, basedir='', remove_file_after=True, *args, **kwargs):
        self.max_length = kwargs.pop('max_length', None)
        self.allow_empty_file = kwargs.pop('allow_empty_file', False)
        self.basedir = basedir
        self.remove_file_after = remove_file_after
        if 'use_url' in kwargs:
            self.use_url = kwargs.pop('use_url')

        super().__init__(*args, **kwargs)

    def to_internal_value(self, data):
        # Check valid UUID
        try:
            UUID(data)
        except ValueError:
            self.fail('invalid')

        # Find uploaded file
        storage = FileSystemStorage()

        # Binary data stored in this file
        filebinpath = self.basedir + '/' + data + '.bin'

        # Original filename stored in this file
        filenamepath = self.basedir + '/' + data + '.name'

        if not storage.exists(filebinpath):
            self.fail('not_found', filepath=filebinpath)

        if not storage.exists(filenamepath):
            self.fail('not_found', filepath=filebinpath)

        binary_content = storage.open(filebinpath, 'rb').read()
        filename = storage.open(filenamepath, 'rb').read()
        out = ContentFile(content=binary_content, name=filename)

        if self.remove_file_after:
            storage.delete(filebinpath)
            storage.delete(filenamepath)

        try:
            # `UploadedFile` objects should have name and size attributes.
            file_name = out.name
            file_size = out.size
        except AttributeError:
            self.fail('invalid')

        if not file_name:
            self.fail('no_name')
        if not self.allow_empty_file and not file_size:
            self.fail('empty')
        if self.max_length and len(file_name) > self.max_length:
            self.fail('max_length', max_length=self.max_length, length=len(file_name))

        return out

    def to_representation(self, value):
        if not value:
            return None

        use_url = getattr(self, 'use_url', api_settings.UPLOADED_FILES_USE_URL)

        if use_url:
            if not getattr(value, 'url', None):
                # If the file has not been saved it may not have a URL.
                return None
            url = value.url
            request = self.context.get('request', None)
            if request is not None:
                return request.build_absolute_uri(url)
            return url

        return value.name


class WritableNestedPermissionModelSerializer(NestedCreateMixin, NestedUpdateMixin, serializers.ModelSerializer):

    def delete_reverse_relations_if_need(self, instance, reverse_relations):
        # Reverse `reverse_relations` for correct delete priority
        reverse_relations = OrderedDict(
            reversed(list(reverse_relations.items())))

        # Delete instances which is missed in data
        for field_name, (related_field, field, field_source) in \
                reverse_relations.items():
            model_class = field.Meta.model

            related_data = self.get_initial()[field_name]
            # Expand to array of one item for one-to-one for uniformity
            if related_field.one_to_one:
                related_data = [related_data]

            # M2M relation can be as direct or as reverse. For direct relation we
            # should use reverse relation name
            if related_field.many_to_many and \
                    not isinstance(related_field, ForeignObjectRel):
                related_field_lookup = {
                    related_field.remote_field.name: instance,
                }
            elif isinstance(related_field, GenericRelation):
                related_field_lookup = \
                    self._get_generic_lookup(instance, related_field)
            else:
                related_field_lookup = {
                    related_field.name: instance,
                }

            current_ids = [d.get('pk') for d in related_data if d is not None]

            exclude_ids = []
            # Add to current_ids M2M without permissions
            if hasattr(model_class, 'filter_objects_by_dependency_group'):
                if not self.context['request'].user.has_role([
                    settings.ADMINISTRATOR_ROLE_KEY,
                    settings.MAINTENANCE_ROLE_KEY,
                    settings.MANAGER_ROLE_KEY
                ]):
                    dependency_groups = list(self.context['request'].user.dependency_groups.all())
                    exclude_ids = model_class.filter_objects_by_dependency_group(dependency_groups)

            try:
                pks_to_delete = list(
                    model_class.objects.filter(
                        **related_field_lookup
                    ).exclude(
                        pk__in=current_ids + exclude_ids
                    ).values_list('pk', flat=True)
                )

                if related_field.many_to_many:
                    # Remove relations from m2m table
                    m2m_manager = getattr(instance, field_source)
                    m2m_manager.remove(*pks_to_delete)
                else:
                    model_class.objects.filter(pk__in=pks_to_delete).delete()

            except ProtectedError as e:
                instances = e.args[1]
                self.fail('cannot_delete_protected', instances=", ".join([
                    str(instance) for instance in instances]))
