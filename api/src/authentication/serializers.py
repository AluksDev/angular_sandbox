from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Department


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'code']


class UserSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    roles = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'department', 'department_name', 'is_active', 'date_joined', 'last_login', 'roles']
        read_only_fields = ['id', 'date_joined', 'last_login', 'roles']

    def get_roles(self, obj):
        roles = []

        if obj.is_superuser:
            roles.append('superuser')
        if obj.is_staff:
            roles.append('staff')

        groups = obj.groups.values_list('name', flat=True)
        roles.extend(groups)

        if not roles:
            roles.append('user')

        return roles


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    roles = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False,
        help_text="List of role names to assign to the user (e.g., ['admin', 'manager'])"
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'department', 'roles']

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def validate_roles(self, value):
        from django.contrib.auth.models import Group

        if value:
            for role_name in value:
                if not Group.objects.filter(name=role_name).exists():
                    raise serializers.ValidationError(f"Role '{role_name}' does not exist")
        return value

    def create(self, validated_data):
        from django.contrib.auth.models import Group

        validated_data.pop('password_confirm')
        roles = validated_data.pop('roles', [])

        user = User.objects.create_user(**validated_data)

        if roles:
            for role_name in roles:
                group = Group.objects.get(name=role_name)
                user.groups.add(group)

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, style={'input_type': 'password'})

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
        else:
            raise serializers.ValidationError('Must include "username" and "password".')

        attrs['user'] = user
        return attrs
