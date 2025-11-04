from rest_framework import viewsets, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from drf_yasg.utils import swagger_auto_schema
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from django.utils import timezone
from django.contrib.auth.models import Group
from drf_yasg import openapi

from .models import User, Department
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    LoginSerializer,
    DepartmentSerializer
)


class AuthView(viewsets.GenericViewSet):
    """Authentication endpoints: login, logout, register"""
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer

    @swagger_auto_schema(
        request_body=LoginSerializer,
        responses={200: UserSerializer}
    )
    @action(detail=False, methods=['post'])
    def login(self, request):
        """Login user and return token"""
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)

        # Update last login timestamp
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        responses={200: 'Logged out successfully'}
    )
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """Logout user by deleting their token"""
        request.user.auth_token.delete()
        return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)

    @swagger_auto_schema(
        request_body=UserRegistrationSerializer,
        responses={201: UserSerializer}
    )
    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new user"""
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = Token.objects.create(user=user)

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        responses={200: UserSerializer}
    )
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user information"""
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


class UserView(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
):
    """User management endpoints"""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    filterset_fields = ['department', 'is_active']

    def get_serializer_class(self):
        """Use UserRegistrationSerializer for create, UserSerializer otherwise"""
        if self.action == 'create':
            return UserRegistrationSerializer
        return UserSerializer

    @swagger_auto_schema(
        request_body=UserRegistrationSerializer,
        responses={201: UserSerializer}
    )
    def create(self, request, *args, **kwargs):
        """Create a new user"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED, headers=headers)

    @swagger_auto_schema(responses={200: UserSerializer(many=True)})
    def list(self, request, *args, **kwargs):
        """List all users"""
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: UserSerializer})
    def retrieve(self, request, *args, **kwargs):
        """Get user details"""
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: UserSerializer})
    def partial_update(self, request, *args, **kwargs):
        """Update user information"""
        return super().partial_update(request, *args, **kwargs)


class DepartmentView(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    """Department CRUD endpoints"""
    permission_classes = [IsAuthenticated]
    serializer_class = DepartmentSerializer
    queryset = Department.objects.all()
    filter_backends = [SearchFilter]
    search_fields = ['name', 'code']

    @swagger_auto_schema(
        request_body=DepartmentSerializer,
        responses={201: DepartmentSerializer}
    )
    def create(self, request, *args, **kwargs):
        """Create a new department"""
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: DepartmentSerializer(many=True)})
    def list(self, request, *args, **kwargs):
        """List all departments"""
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(responses={200: DepartmentSerializer})
    def retrieve(self, request, *args, **kwargs):
        """Get department details"""
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=DepartmentSerializer,
        responses={200: DepartmentSerializer}
    )
    def update(self, request, *args, **kwargs):
        """Update department information (full update)"""
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        request_body=DepartmentSerializer,
        responses={200: DepartmentSerializer}
    )
    def partial_update(self, request, *args, **kwargs):
        """Update department information (partial update)"""
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(responses={204: 'Department deleted successfully'})
    def destroy(self, request, *args, **kwargs):
        """Delete a department"""
        return super().destroy(request, *args, **kwargs)
