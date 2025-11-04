# Login User Endpoint

## Endpoint Details

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Authentication Required**: No
- **Content-Type**: `application/json`

## Description

Authenticates a user with their username/email and password. Upon successful authentication, returns a JWT token that can be used to access protected endpoints.

## Request Body

### Required Fields

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `usernameOrEmail` | string | Username or email of the account | Required, not blank |
| `password` | string | Password for the account | Required, not blank |

### Request Example

**Login with Username**:
```json
{
  "usernameOrEmail": "testuser",
  "password": "password123"
}
```

**Login with Email**:
```json
{
  "usernameOrEmail": "test@example.com",
  "password": "password123"
}
```

## Success Response

### Status Code
`200 OK`

### Response Body

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTc2MjI2NDY2MCwiZXhwIjoxNzYyMzUxMDYwfQ.LkWS6vgw8OfE3uIpXxUVQagIhf9CRbIaVALN0qojW2tKzN1ERdBPqqkjlqkCn54Z3RLJvhN6-ulfFcKoA2r0qQ",
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
| `username` | string | Username of the logged-in user |
| `email` | string | Email of the logged-in user |
| `role` | string | User role (USER or ADMIN) |

## Error Scenarios

### 1. Invalid Username/Email

**Status Code**: `401 Unauthorized`

**Request**:
```json
{
  "usernameOrEmail": "nonexistentuser",
  "password": "password123"
}
```

**Response**:
```json
{
  "message": "Invalid username/email or password"
}
```

### 2. Invalid Password

**Status Code**: `401 Unauthorized`

**Request**:
```json
{
  "usernameOrEmail": "testuser",
  "password": "wrongpassword"
}
```

**Response**:
```json
{
  "message": "Invalid username/email or password"
}
```

### 3. Inactive Account

**Status Code**: `400 Bad Request`

**Request**:
```json
{
  "usernameOrEmail": "inactiveuser",
  "password": "password123"
}
```

**Response**:
```json
{
  "message": "Account is inactive. Please contact support."
}
```

### 4. Missing Username/Email

**Status Code**: `400 Bad Request`

**Request**:
```json
{
  "password": "password123"
}
```

**Response**:
```json
{
  "usernameOrEmail": "Username or email is required"
}
```

### 5. Missing Password

**Status Code**: `400 Bad Request`

**Request**:
```json
{
  "usernameOrEmail": "testuser"
}
```

**Response**:
```json
{
  "password": "Password is required"
}
```

### 6. Empty Credentials

**Status Code**: `400 Bad Request`

**Request**:
```json
{
  "usernameOrEmail": "",
  "password": ""
}
```

**Response**:
```json
{
  "usernameOrEmail": "Username or email is required",
  "password": "Password is required"
}
```

### 7. Invalid JSON Format

**Status Code**: `400 Bad Request`

**Request**:
```
{usernameOrEmail: "testuser", password: password123}
```

**Response**:
```json
{
  "status": 400,
  "message": "JSON parse error",
  "timestamp": "2025-11-04T21:57:26"
}
```

### 8. Empty Request Body

**Status Code**: `400 Bad Request`

**Request**:
```json
{}
```

**Response**:
```json
{
  "usernameOrEmail": "Username or email is required",
  "password": "Password is required"
}
```

## cURL Examples

### Login with Username

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }'
```

### Login with Email

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "test@example.com",
    "password": "password123"
  }'
```

### With Pretty JSON Output

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }' | python3 -m json.tool
```

### Save Token to Variable (Bash)

```bash
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }')

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")
echo "Token saved: $TOKEN"

# Use the token in subsequent requests
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Save Token to Environment Variable

```bash
export TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }' | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

echo "Token: $TOKEN"
```

### Production Environment

```bash
curl -X POST https://dcisman.gdgoc.tech/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }'
```

### Test Invalid Credentials

```bash
# Wrong password
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "wrongpassword"
  }'

# Non-existent user
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "nonexistentuser",
    "password": "password123"
  }'
```

## Testing Checklist

- [ ] Login with valid username and password - should return 200 with token
- [ ] Login with valid email and password - should return 200 with token
- [ ] Login with invalid username - should return 401
- [ ] Login with invalid email - should return 401
- [ ] Login with wrong password - should return 401
- [ ] Login with missing username/email - should return 400
- [ ] Login with missing password - should return 400
- [ ] Login with inactive account - should return 400
- [ ] Login with empty credentials - should return 400
- [ ] Verify JWT token is valid
- [ ] Verify token can be used to access protected endpoints
- [ ] Test both username and email login methods
- [ ] Verify token expiration is set correctly (24 hours)

## Notes

- **Flexible Login**: Users can login with either username or email
- **Security**: The endpoint returns the same error message for invalid username/email and invalid password to prevent username enumeration attacks
- **Password Verification**: Passwords are verified using BCrypt comparison
- **Token Generation**: A fresh JWT token is generated on each successful login
- **Token Expiration**: JWT tokens expire after 24 hours
- **Case Sensitivity**: Username and email lookups are case-sensitive
- **Account Status**: Inactive accounts cannot login
- **Rate Limiting**: Consider implementing rate limiting to prevent brute force attacks (future enhancement)

## Security Considerations

1. **Password Security**:
   - Passwords are never stored in plain text
   - BCrypt is used for secure password hashing
   - Password verification is done server-side

2. **Error Messages**:
   - Generic error messages prevent username enumeration
   - Same message for invalid username/email and wrong password

3. **Token Security**:
   - JWT tokens are signed with a secure secret
   - Tokens include expiration time
   - Tokens should be stored securely on the client side

4. **Best Practices**:
   - Use HTTPS in production
   - Store tokens in httpOnly cookies or secure storage
   - Implement logout on the client side by removing tokens
   - Consider implementing refresh tokens for better security

## Related Endpoints

- [Register](./register.md) - `/api/auth/register` - Create a new account
- [Get Current User](./me.md) - `/api/auth/me` - Get user information with token
- [Logout](./logout.md) - `/api/auth/logout` - Logout user

## Common Use Cases

### 1. Login and Access Protected Resource

```bash
# Step 1: Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "testuser", "password": "password123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Step 2: Use token to access protected endpoint
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Verify Token is Working

```bash
# Login and test token immediately
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "testuser", "password": "password123"}')

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Test the token
if curl -s -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | grep -q "username"; then
  echo "✓ Token is valid"
else
  echo "✗ Token is invalid"
fi
```

### 3. Handle Login Errors

```bash
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "testuser", "password": "password123"}')

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ]; then
  echo "✓ Login successful"
  TOKEN=$(echo $BODY | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")
  echo "Token: $TOKEN"
else
  echo "✗ Login failed with status $HTTP_CODE"
  echo "Error: $BODY"
fi
```

## Troubleshooting

### Issue: "Invalid username/email or password"
- Verify the user exists in the database
- Check if the password is correct
- Ensure you're using the correct case for username/email

### Issue: "Account is inactive"
- Check the `is_active` field in the database
- Contact administrator to reactivate the account

### Issue: Token not working after login
- Verify the token is being properly extracted from the response
- Check the Authorization header format: `Bearer <token>`
- Ensure the token hasn't expired

### Issue: Cannot login with email
- Verify the email exists in the database
- Check for typos in the email address
- Ensure the email format is correct
