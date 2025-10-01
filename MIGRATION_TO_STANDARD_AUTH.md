# Migración a Autenticación Estándar

Este documento explica los cambios realizados para convertir el sistema de autenticación personalizado IMI a autenticación estándar de Django REST Framework.

## Cambios Realizados

### 1. Nueva App de Autenticación

Se ha creado una nueva app Django `authentication` en `api/src/authentication/` con:

- **Models** (`models.py`):
  - `User`: Modelo personalizado que extiende `AbstractUser` de Django
  - `Department`: Modelo de departamentos (migrado desde imiauth)

- **Views** (`views.py`):
  - `AuthView`: Login, logout, register, y endpoint "me"
  - `UserView`: Gestión de usuarios
  - `DepartmentView`: Gestión de departamentos

- **Serializers** (`serializers.py`):
  - `UserSerializer`, `LoginSerializer`, `UserRegistrationSerializer`
  - `DepartmentSerializer`

### 2. Cambios en Settings

En `api/src/main/settings/base.py`:

- ✅ Reemplazado `imiauth` por `authentication` en `LOCAL_APPS`
- ✅ Cambiado `AUTHENTICATION_BACKENDS` a `ModelBackend` estándar
- ✅ Actualizado `AUTH_USER_MODEL` a `authentication.User`
- ✅ Eliminados middlewares personalizados IMI
- ✅ Configurado `REST_FRAMEWORK` con `TokenAuthentication` y `SessionAuthentication`

### 3. Cambios en URLs

En `api/src/main/urls.py`:

- ✅ Importado `authentication.views` en lugar de `imiauth.views`
- ✅ Cambiado endpoint `/imiauth/` a `/auth/`

### 4. Cambios en Game App

- ✅ `views.py`: Eliminadas referencias a roles IMI, usando `permissions.IsAuthenticated`
- ✅ `models.py`: Actualizado ForeignKey a `authentication.User` y `authentication.Department`
- ✅ `serializers.py`: Actualizado import de `DepartmentSerializer`
- ✅ `tests.py`: Actualizado import de `User` y `Department`

## Aplicar las Migraciones

**IMPORTANTE**: Las migraciones existentes hacen referencia a `imiauth`. Necesitas:

### Opción 1: Reset completo de la base de datos (Recomendado para desarrollo)

```bash
cd api

# Eliminar la base de datos existente (si es SQLite para desarrollo)
rm db.sqlite3

# Eliminar todas las migraciones del app game
rm -rf src/game/migrations/00*.py

# Crear nuevas migraciones
docker compose run --rm django python manage.py makemigrations authentication
docker compose run --rm django python manage.py makemigrations game

# Aplicar migraciones
docker compose run --rm django python manage.py migrate

# Crear superusuario
docker compose run --rm django python manage.py createsuperuser
```

### Opción 2: Migración desde base de datos existente

Si tienes datos que quieres mantener, necesitarás:

1. Renombrar las tablas de `imiauth_*` a `authentication_*`
2. Actualizar las migraciones existentes para referenciar `authentication` en lugar de `imiauth`

## Endpoints de Autenticación

### Registro
```bash
POST /services/sandbox/auth/register/
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "securepass123",
  "password_confirm": "securepass123",
  "first_name": "Test",
  "last_name": "User",
  "department": 1  # opcional
}
```

### Login
```bash
POST /services/sandbox/auth/login/
{
  "username": "testuser",
  "password": "securepass123"
}

# Respuesta:
{
  "token": "abc123...",
  "user": {...}
}
```

### Usar el Token
```bash
# En todas las peticiones autenticadas
Authorization: Token abc123...
```

### Obtener información del usuario actual
```bash
GET /services/sandbox/auth/me/
Authorization: Token abc123...
```

### Logout
```bash
POST /services/sandbox/auth/logout/
Authorization: Token abc123...
```

## Diferencias con el Sistema Anterior

| Antes (IMI) | Ahora (Estándar) |
|-------------|------------------|
| Custom IMI Authentication Backend | Django ModelBackend |
| IMI Middlewares (IDP Simulator) | Sin middlewares custom |
| Roles personalizados IMI | Django `is_staff` / `is_superuser` |
| Endpoint `/imiauth/` | Endpoint `/auth/` |
| Custom role checking (`has_role`) | Django permissions (`is_staff`) |

## Testing

Después de aplicar los cambios:

1. Iniciar servicios:
```bash
make up
```

2. Crear un usuario de prueba vía API o Django admin

3. Probar endpoints en http://localhost:8000/swagger/

4. Verificar autenticación en el frontend Angular

## Notas

- El sistema anterior usaba roles personalizados (`ADMINISTRATOR_ROLE`, `MANAGER_ROLE`). Ahora se usa `user.is_staff` para determinar permisos de administrador.
- Los departamentos se mantienen igual, solo cambiaron de app.
- Token authentication es más simple y estándar que el sistema IMI previo.
