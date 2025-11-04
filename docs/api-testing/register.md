# Register User Endpoint

## Endpoint Details

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Authentication Required**: No
- **Content-Type**: `application/json`

## Description

Creates a new user account in the system. Upon successful registration, the user is automatically logged in and receives a JWT token.

## Request Body

### Required Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `username` | string | Unique username for the account | 3-50 characters, required |
| `email` | string | Valid email address | Must be valid email format, max 100 characters, required |
| `password` | string | Password for the account | 6-100 characters, required |

### Request Example

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

## Success Response

### Status Code
`201 Created`

### Response Body

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTc2MjI2NDY0NiwiZXhwIjoxNzYyMzUxMDQ2fQ.oEZ4R08kodkaR-OPMrRVjQOc79aj_pisLteKHqooeT-Ww-2l1nN11BHH1zoFXx8SDerwDrckfUQFFK5Dxr7ZEw",
  "type": "Bearer",
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "role": "USER"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `token` | string | JWT token for authentication |
| `type` | string | Token type (always "Bearer") |
| `id` | number | Unique user ID |
| `username` | string | Username of the registered user |
| `email` | string | Email of the registered user |
| `role` | string | User role (USER or ADMIN) |

## Error Scenarios

### 1. Username Already Taken

**Status Code**: `400 Bad Request`

**Request**:
```json
{
  "username": "existinguser",
  "email": "newemail@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "message": "Username is already taken"
}
```

### 2. Email Already Registered

**Status Code**: `400 Bad Request`

**Request**:
```json
{
  "username": "newuser",
  "email": "existing@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "message": "Email is already registered"
}
```

### 3. Validation Error - Missing Username

**Status Code**: `400 Bad Request`

**Request**:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "username": "Username is required"
}
```

### 4. Validation Error - Invalid Email

**Status Code**: `400 Bad Request`

**Request**:
```json
{
  "username": "testuser",
  "email": "notanemail",
  "password": "password123"
}
```

**Response**:
```json
{
  "email": "Email must be valid"
}
```

### 5. Validation Error - Password Too Short

**Status Code**: `400 Bad Request`

**Request**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "12345"
}
```

**Response**:
```json
{
  "password": "Password must be between 6 and 100 characters"
}
```

### 6. Validation Error - Username Too Short

**Status Code**: `400 Bad Request`

**Request**:
```json
{
  "username": "ab",
  "email": "test@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "username": "Username must be between 3 and 50 characters"
}
```

### 7. Validation Error - Multiple Fields

**Status Code**: `400 Bad Request`

**Request**:
```json
{
  "username": "ab",
  "email": "notanemail",
  "password": "123"
}
```

**Response**:
```json
{
  "username": "Username must be between 3 and 50 characters",
  "email": "Email must be valid",
  "password": "Password must be between 6 and 100 characters"
}
```

### 8. Invalid JSON Format

**Status Code**: `400 Bad Request`

**Request**:
```
{username: "testuser", email: test@example.com}
```

**Response**:
```json
{
  "status": 400,
  "message": "JSON parse error",
  "timestamp": "2025-11-04T21:57:26"
}
```

### 9. Empty Request Body

**Status Code**: `400 Bad Request`

**Request**:
```json
{}
```

**Response**:
```json
{
  "username": "Username is required",
  "email": "Email is required",
  "password": "Password is required"
}
```

## cURL Examples

### Successful Registration

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### With Pretty JSON Output

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }' | python3 -m json.tool
```

### Save Token to Variable

```bash
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }')

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")
echo "Token: $TOKEN"
```

### Production Environment

```bash
curl -X POST https://dcisman.gdgoc.tech/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Testing Checklist

- [ ] Register with valid data - should return 201 with token
- [ ] Register with duplicate username - should return 400
- [ ] Register with duplicate email - should return 400
- [ ] Register with missing username - should return 400
- [ ] Register with missing email - should return 400
- [ ] Register with missing password - should return 400
- [ ] Register with invalid email format - should return 400
- [ ] Register with short username (< 3 chars) - should return 400
- [ ] Register with long username (> 50 chars) - should return 400
- [ ] Register with short password (< 6 chars) - should return 400
- [ ] Verify user created in database
- [ ] Verify password is hashed (not stored as plain text)
- [ ] Verify JWT token is valid and can be used for authentication

## Notes

- **Default Role**: All new users are assigned the `USER` role by default
- **Active Status**: All new users have `isActive` set to `true` by default
- **Password Security**: Passwords are hashed using BCrypt before storage
- **Automatic Login**: Successful registration automatically logs the user in
- **Token Expiration**: The returned JWT token expires after 24 hours
- **Case Sensitivity**: Usernames and emails are case-sensitive in the database
- **Whitespace**: Leading/trailing whitespace in fields is trimmed

## Related Endpoints

- [Login](./login.md) - `/api/auth/login` - Login with registered credentials
- [Get Current User](./me.md) - `/api/auth/me` - Get user information with token
- [Logout](./logout.md) - `/api/auth/logout` - Logout user

## Database Impact

Upon successful registration, a new record is created in the `users` table:

```sql
INSERT INTO users (username, email, password_hash, role, is_active, created_at, updated_at)
VALUES ('testuser', 'test@example.com', '$2a$10$...', 'USER', 1, NOW(), NOW());
```

You can verify registration by querying:

```bash
mysql -u root dcisman -e "SELECT id, username, email, role, is_active, created_at FROM users;"
```
