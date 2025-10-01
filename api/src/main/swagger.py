from django.conf import settings
from drf_yasg import openapi
from drf_yasg.inspectors import SwaggerAutoSchema

GEOMETRY_CHOICES = [
    'POINT', 'LINESTRING', 'POLYGON', 'MULTIPOINT', 'MULTILINESTRING', 'MULTIPOLYGON', 'GEOMETRYCOLLECTION'
]


class IMISwaggerAutoSchema(SwaggerAutoSchema):
    def get_tags(self, operation_keys):
        return ["_".join(operation_keys[0:-1])]

    def get_operation(self, operation_keys):
        """
        Adds '"x-my-tag":value' to operation dictionary with all overrides "x_whatever"
        The override key must begin with "x_"

        Example:

            @swagger_auto_schema(
                responses={
                    status.HTTP_200_OK: AttributeCategorySerializer,
                    status.HTTP_404_NOT_FOUND: 'Not found'
                },
                x_app_roles = {
                    'customer': 'customer allows getting own information'
                }
            )
            def retrieve(self, request, *args, **kwargs):
                ...

        :param operation_keys:
        :return: openapi.Operation
        """
        operation = super(IMISwaggerAutoSchema, self).get_operation(operation_keys)

        fields_parameter = openapi.Parameter(
            "fields",
            openapi.IN_QUERY,
            description="List of fields",
            type=openapi.TYPE_STRING,
        )
        expand_parameter = openapi.Parameter(
            "expand",
            openapi.IN_QUERY,
            description="List of nested objects",
            type=openapi.TYPE_STRING,
        )

        parameters = getattr(operation, "parameters")

        # Add fields and expand to all views for dynamic serializers
        setattr(
            operation, "parameters", parameters + [fields_parameter, expand_parameter]
        )

        # Add default x-imi-roles value to all endpoints, if defined in settings
        if hasattr(settings, "X_IMI_ROLES"):
            setattr(operation, "x-imi-roles", settings.X_IMI_ROLES)

        for k in self.overrides:
            if k.startswith("x_"):
                setattr(operation, k.replace("_", "-"), self.overrides[k])

        return operation
