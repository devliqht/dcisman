# Get Current User Endpoint

## Endpoint Details

- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Authentication Required**: **Yes** (JWT Token)
- **Content-Type**: N/A (no request body)

## Description

Retrieves the current authenticated user's information. This is a protected endpoint that requires a valid JWT token in the Authorization header.

## Request Headers

### Required Headers

| Header | Value | Description |
|--------|-------|-------------|
| `Authorization` | `Bearer <token>` | JWT token obtained from login or registration |

### Request Example

```bash
GET /api/auth/me HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTc2MjI2NDY2MCwiZXhwIjoxNzYyMzUxMDYwfQ...
```

## Success Response

### Status Code
`200 OK`

### Response Body

```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "role": "USER",
  "isActive": true,
  "createdAt": "2025-11-04T21:57:26"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique user ID |
| `username` | string | Username of the user |
| `email` | string | Email address of the user |
| `role` | string | User role (USER or ADMIN) |
| `isActive` | boolean | Whether the account is active |
| `createdAt` | string | ISO 8601 timestamp of account creation |

## Error Scenarios

### 1. Missing Authorization Header

**Status Code**: `401 Unauthorized`

**Request**:
```bash
GET /api/auth/me HTTP/1.1
Host: localhost:8080
```

**Response**:
```json
{
  "message": "Unauthorized"
}
```

### 2. Invalid Token Format

**Status Code**: `401 Unauthorized`

**Request**:
```bash
GET /api/auth/me HTTP/1.1
Host: localhost:8080
Authorization: InvalidTokenFormat
```

**Response**:
```json
{
  "message": "Unauthorized"
}
```

### 3. Missing "Bearer" Prefix

**Status Code**: `401 Unauthorized`

**Request**:
```bash
GET /api/auth/me HTTP/1.1
Host: localhost:8080
Authorization: eyJhbGciOiJIUzUxMiJ9...
```

**Response**:
```json
{
  "message": "Unauthorized"
}
```

**Note**: Token must be prefixed with "Bearer " (with a space)

### 4. Expired Token

**Status Code**: `401 Unauthorized`

**Request**:
```bash
GET /api/auth/me HTTP/1.1
Host: localhost:8080
Authorization: Bearer <expired_token>
```

**Response**:
```json
{
  "message": "Unauthorized"
}
```

### 5. Invalid Token Signature

**Status Code**: `401 Unauthorized`

**Request**:
```bash
GET /api/auth/me HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.invalid_signature
```

**Response**:
```json
{
  "message": "Unauthorized"
}
```

### 6. Malformed Token

**Status Code**: `401 Unauthorized`

**Request**:
```bash
GET /api/auth/me HTTP/1.1
Host: localhost:8080
Authorization: Bearer not.a.valid.jwt.token
```

**Response**:
```json
{
  "message": "Unauthorized"
}
```

### 7. User Not Found (Token Valid but User Deleted)

**Status Code**: `400 Bad Request`

**Response**:
```json
{
  "message": "User not found: username"
}
```

**Note**: This occurs when the token is valid but the user has been deleted from the database.

## cURL Examples

### Basic Request

```bash
# Replace YOUR_TOKEN with actual JWT token
TOKEN="eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTc2MjI2NDY2MCwiZXhwIjoxNzYyMzUxMDYwfQ..."

curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### With Pretty JSON Output

```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool
```

### Complete Login and Get User Flow

```bash
# Step 1: Login to get token
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }')

# Step 2: Extract token
TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Step 3: Get current user info
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Test Token Expiration

```bash
# Use an old token (will fail if expired)
OLD_TOKEN="your_old_token_here"

curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $OLD_TOKEN" \
  -w "\nHTTP Status: %{http_code}\n"
```

### Verbose Output (Show Headers)

```bash
curl -v -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Production Environment

```bash
curl -X GET https://dcisman.gdgoc.tech/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Test Without Token (Should Fail)

```bash
curl -X GET http://localhost:8080/api/auth/me \
  -w "\nHTTP Status: %{http_code}\n"
```

## Testing Checklist

- [ ] Get user info with valid token - should return 200 with user data
- [ ] Request without Authorization header - should return 401
- [ ] Request with invalid token - should return 401
- [ ] Request with expired token - should return 401
- [ ] Request with malformed token - should return 401
- [ ] Request without "Bearer" prefix - should return 401
- [ ] Request with token of deleted user - should return 400
- [ ] Verify all user fields are returned correctly
- [ ] Verify timestamps are in correct format
- [ ] Test with both USER and ADMIN roles
- [ ] Verify password is NOT included in response

## Notes

- **Authentication Required**: This endpoint always requires a valid JWT token
- **Token Validation**: The token is validated on every request
- **Token Expiration**: Tokens expire after 24 hours from creation
- **Password Security**: The password hash is never included in the response
- **Real-time Data**: Returns the most up-to-date user information from the database
- **Performance**: This is a lightweight endpoint suitable for frequent calls
- **Use Case**: Commonly used to verify authentication status and display user info in UI

## Security Considerations

1. **Token Validation**:
   - Token signature is verified on every request
   - Expired tokens are rejected
   - Malformed tokens are rejected

2. **Sensitive Data**:
   - Password hash is never returned
   - Only necessary user information is exposed

3. **Best Practices**:
   - Always use HTTPS in production
   - Store tokens securely on the client
   - Don't log or expose tokens
   - Handle token expiration gracefully

## Response Field Details

### `id`
- Type: `number`
- Description: Unique identifier for the user
- Example: `1`

### `username`
- Type: `string`
- Description: User's unique username
- Example: `"testuser"`
- Note: Case-sensitive

### `email`
- Type: `string`
- Description: User's email address
- Example: `"test@example.com"`
- Note: Case-sensitive

### `role`
- Type: `string`
- Description: User's role in the system
- Possible Values: `"USER"`, `"ADMIN"`
- Example: `"USER"`

### `isActive`
- Type: `boolean`
- Description: Whether the user account is active
- Example: `true`
- Note: Inactive users cannot login

### `createdAt`
- Type: `string` (ISO 8601 datetime)
- Description: When the account was created
- Example: `"2025-11-04T21:57:26"`
- Format: `YYYY-MM-DDTHH:mm:ss`

## Related Endpoints

- [Register](./register.md) - `/api/auth/register` - Create a new account
- [Login](./login.md) - `/api/auth/login` - Get JWT token
- [Logout](./logout.md) - `/api/auth/logout` - Logout user

## Common Use Cases

### 1. Verify Authentication Status

```bash
# Check if user is logged in
TOKEN=$STORED_TOKEN

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✓ User is authenticated"
else
  echo "✗ User is not authenticated (redirect to login)"
fi
```

### 2. Display User Profile

```bash
# Get user info to display in UI
TOKEN=$STORED_TOKEN

USER_INFO=$(curl -s -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

USERNAME=$(echo $USER_INFO | python3 -c "import sys, json; print(json.load(sys.stdin)['username'])")
EMAIL=$(echo $USER_INFO | python3 -c "import sys, json; print(json.load(sys.stdin)['email'])")

echo "Logged in as: $USERNAME ($EMAIL)"
```

### 3. Check User Role

```bash
# Check if user is admin
TOKEN=$STORED_TOKEN

ROLE=$(curl -s -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['role'])")

if [ "$ROLE" = "ADMIN" ]; then
  echo "✓ User has admin privileges"
else
  echo "User is a regular user"
fi
```

### 4. Refresh User Data

```bash
# Periodically refresh user data
while true; do
  USER_DATA=$(curl -s -X GET http://localhost:8080/api/auth/me \
    -H "Authorization: Bearer $TOKEN")

  echo "Current user data: $USER_DATA"
  sleep 60  # Refresh every minute
done
```

## Integration Examples

### JavaScript/Frontend

```javascript
// Get current user
async function getCurrentUser(token) {
  try {
    const response = await fetch('http://localhost:8080/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const user = await response.json();
      console.log('Current user:', user);
      return user;
    } else {
      console.error('Not authenticated');
      // Redirect to login
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### React Example

```javascript
import { useEffect, useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchUser() {
      const response = await fetch('http://localhost:8080/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    }

    fetchUser();
  }, [token]);

  return user ? (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
```

## Troubleshooting

### Issue: "Unauthorized" error with valid token
- Check if token is expired (tokens expire after 24 hours)
- Verify Authorization header format: `Bearer <token>` with space
- Ensure token hasn't been tampered with

### Issue: Token works in Postman but not in browser
- Check for CORS issues
- Verify credentials are being sent
- Check if token is being properly stored/retrieved

### Issue: "User not found" error
- User may have been deleted from database
- User needs to login again to get new token

### Issue: Token expires too quickly
- Check server time configuration
- Verify JWT expiration setting (should be 24 hours)
- Consider implementing token refresh mechanism
