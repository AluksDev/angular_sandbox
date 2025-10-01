from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Department


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code']
    search_fields = ['name', 'code']


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'department', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'department']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Department', {'fields': ('department',)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Department', {'fields': ('department',)}),
    )
