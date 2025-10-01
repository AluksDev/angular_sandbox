from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path, re_path
from django.views import defaults as default_views
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import routers, permissions

from authentication import views as auth_views
from game import views as game_views

# drf-yasg
schema_view = get_schema_view(
    info=openapi.Info(
        title="Sandbox API",
        default_version="0.0.1",
        description="Sandbox",
        terms_of_service="http://example.com",
        contact=openapi.Contact(
            name="IMI",
            url="http://ajuntament.barcelona.cat/imi/es",
            email="sandbox@example.com",
        ),
        license=openapi.License(name="IMI"),
    ),
    validators=["flex", "ssv"],
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        schema_view.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^swagger/$",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$",
        schema_view.with_ui("redoc", cache_timeout=0),
        name="schema-redoc",
    ),
    re_path(r"^ht/", include("health_check.urls")),
]

# routes
router = routers.DefaultRouter()

router.register(
    r"auth",
    auth_views.AuthView,
    basename="auth"
)

router.register(
    r"user",
    auth_views.UserView,
    basename="user"
)

router.register(
    r"game_question",
    game_views.GameQuestionView,
    basename="game_question"
)

router.register(
    r"game_answer",
    game_views.GameAnswerView,
    basename="game_answer"
)

router.register(
    r"game_user_answer",
    game_views.UserAnswerView,
    basename="game_user_answer"
)

router.register(
    r"score",
    game_views.ScoreView,
    basename="score"
)

router.register(
    r"department",
    auth_views.DepartmentView,
    basename="department"
)

urlpatterns += [
                   re_path(r"^services/sandbox/v1/", include((router.urls, "v1"), namespace="v1")),
                   re_path(r"^services/sandbox/", include((router.urls, "current"), namespace="current")),

               ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    # This allows the error pages to be debugged during development, just visit
    # these url in browser to see how these error pages look like.
    urlpatterns += [
        path(
            "400/",
            default_views.bad_request,
            kwargs={"exception": Exception("Bad Request!")},
        ),
        path(
            "403/",
            default_views.permission_denied,
            kwargs={"exception": Exception("Permission Denied")},
        ),
        path(
            "404/",
            default_views.page_not_found,
            kwargs={"exception": Exception("Page not Found")},
        ),
        path("500/", default_views.server_error),
    ]
