from drf_yasg import openapi

paginator_manual_params = [
    openapi.Parameter(
        "limit",
        openapi.IN_QUERY,
        description="Paginator Limit",
        type=openapi.TYPE_INTEGER,
    ),
    openapi.Parameter(
        "offset",
        openapi.IN_QUERY,
        description="Paginator Offset",
        type=openapi.TYPE_INTEGER,
    ),
]
