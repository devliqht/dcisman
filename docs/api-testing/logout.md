# Logout User Endpoint

## Endpoint Details

- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Authentication Required**: No (but typically called with a token)
- **Content-Type**: N/A (no request body needed)

## Description

Logs out the current user. Since JWT tokens are stateless, the actual logout is handled on the client side by removing the token. This endpoint exists for consistency with typical authentication flows and can be extended in the future for additional logout logic (e.g., token blacklisting, session cleanup).

## Request Headers

### Optional Headers

| Header | Value | Description |
|--------|-------|-------------|
| `Authorization` | `Bearer <token>` | JWT token (optional, can be included but not required) |

### Request Example

```bash
POST /api/auth/logout HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9... (optional)
```

## Success Response

### Status Code
`200 OK`

### Response Body

```json
{
  "message": "Logout successful"
}
```

## Error Scenarios

**Note**: This endpoint currently doesn't have error scenarios as it always returns success. Future enhancements may include:
- Token blacklisting validation
- Session cleanup verification
- Audit logging failures

### Future Error Scenarios (Not Implemented Yet)

These may be implemented in future versions:

#### 1. Token Blacklisting Failure
```json
{
  "status": 500,
  "message": "Failed to blacklist token",
  "timestamp": "2025-11-04T21:57:26"
}
```

#### 2. Invalid Token Format
```json
{
  "status": 400,
  "message": "Invalid token format",
  "timestamp": "2025-11-04T21:57:26"
}
```

## cURL Examples

### Basic Logout

```bash
curl -X POST http://localhost:8080/api/auth/logout
```

### Logout with Token

```bash
TOKEN="eyJhbGciOiJIUzUxMiJ9..."

curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

### With Pretty JSON Output

```bash
curl -X POST http://localhost:8080/api/auth/logout | python3 -m json.tool
```

### Complete Logout Flow

```bash
# Step 1: Login
RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }')

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")
echo "Logged in with token: $TOKEN"

# Step 2: Use the token (verify it works)
curl -s -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Step 3: Logout
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"

echo "Logged out successfully"

# Step 4: Verify token no longer works (client-side cleanup)
# Note: Token is still technically valid on server, but client should remove it
```

### Production Environment

```bash
curl -X POST https://dcisman.gdgoc.tech/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

## Testing Checklist

- [ ] Logout without token - should return 200
- [ ] Logout with valid token - should return 200
- [ ] Logout with invalid token - should return 200 (current behavior)
- [ ] Verify response message is correct
- [ ] Test multiple consecutive logouts - all should succeed

## Notes

- **Stateless Tokens**: JWT tokens are stateless, meaning the server doesn't track them
- **Client-Side Logout**: The actual logout is performed by removing the token from client storage
- **Token Validity**: After calling this endpoint, the token is technically still valid until it expires
- **Future Enhancements**: This endpoint can be extended to implement:
  - Token blacklisting
  - Session cleanup
  - Logout event logging
  - Multi-device logout
  - Refresh token revocation
- **Consistency**: This endpoint exists to maintain consistency with standard authentication patterns
- **No Side Effects**: Currently has no server-side side effects

## Client-Side Implementation

The logout endpoint should be used in conjunction with client-side token removal:

### JavaScript Example

```javascript
async function logout(token) {
  try {
    // Call server logout endpoint
    const response = await fetch('http://localhost:8080/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      // Remove token from client storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      console.log('Logged out successfully');

      // Redirect to login page
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout error:', error);

    // Still remove token even if server call fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
}
```

### React Example

```javascript
import { useAuth } from '../context/AuthContext';

function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Call logout from auth context (which calls the API and cleans up)
      await logout();

      // Redirect is handled by the auth context
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even on error
      window.location.href = '/login';
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Auth Context Example

```javascript
// In AuthContext.jsx
const logout = async () => {
  try {
    // Optional: Call server logout endpoint
    await fetch('http://localhost:8080/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  } catch (error) {
    console.error('Server logout failed:', error);
  } finally {
    // Always clean up client-side, regardless of server response
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }
};
```

## Security Considerations

1. **Token Removal**: Always remove tokens from client storage after logout
2. **Secure Storage**: Tokens should be stored securely (httpOnly cookies are best)
3. **Multiple Tabs**: Consider using localStorage events to sync logout across tabs
4. **Session Management**: For better security, consider implementing:
   - Token blacklisting
   - Short-lived access tokens with refresh tokens
   - Server-side session tracking

## Best Practices

1. **Always Clear Client State**:
   ```javascript
   // Clear all auth-related data
   localStorage.removeItem('token');
   localStorage.removeItem('user');
   sessionStorage.clear(); // If used
   ```

2. **Redirect After Logout**:
   ```javascript
   // Always redirect to login or public page
   window.location.href = '/login';
   ```

3. **Handle Errors Gracefully**:
   ```javascript
   // Still logout client-side even if server call fails
   try {
     await callLogoutAPI();
   } finally {
     clearTokens();
     redirect();
   }
   ```

4. **Multi-Tab Coordination**:
   ```javascript
   // Listen for storage changes to sync logout across tabs
   window.addEventListener('storage', (e) => {
     if (e.key === 'token' && e.newValue === null) {
       // Token was removed in another tab
       window.location.href = '/login';
     }
   });
   ```

## Related Endpoints

- [Register](./register.md) - `/api/auth/register` - Create a new account
- [Login](./login.md) - `/api/auth/login` - Get JWT token
- [Get Current User](./me.md) - `/api/auth/me` - Verify authentication

## Common Use Cases

### 1. Basic Logout Flow

```bash
# Logout and clean up
curl -X POST http://localhost:8080/api/auth/logout
# Then manually remove token from storage
```

### 2. Logout All Devices (Future Enhancement)

```bash
# Not implemented yet, but could look like:
curl -X POST http://localhost:8080/api/auth/logout/all \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Verify Logout

```bash
# Step 1: Logout
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# Step 2: Try to access protected endpoint (should fail after token removal)
# Note: Will still work because token is valid, but client should remove it
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Future Enhancements

### Token Blacklisting

When implemented, logout will:
1. Add token to a blacklist/denylist
2. Reject all future requests with that token
3. Clean up expired tokens from blacklist

```bash
# Future implementation
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# Future response
{
  "message": "Logout successful",
  "tokenBlacklisted": true,
  "expiresAt": "2025-11-05T21:57:26"
}
```

### Refresh Token Revocation

When refresh tokens are implemented:
```bash
# Future: Revoke refresh token
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "refresh_token_here"}'
```

### Audit Logging

Future logout may log:
- User ID
- Logout timestamp
- IP address
- User agent
- Reason (manual, forced, timeout, etc.)

## Comparison with Other Auth Systems

### Session-Based Auth
- Session-based systems destroy server-side sessions on logout
- JWT systems don't track sessions, so logout is client-side only

### OAuth 2.0
- OAuth systems may revoke tokens on the authorization server
- Our system is simpler and focuses on client-side cleanup

### Token Blacklisting
- Some JWT systems maintain a blacklist of revoked tokens
- Trade-off: complexity vs. security
- Can be implemented as a future enhancement

## Testing Scenarios

### Manual Testing

1. **Login → Use Token → Logout → Verify**:
   ```bash
   # Login and get token
   TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"usernameOrEmail": "testuser", "password": "password123"}' \
     | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

   # Use token (should work)
   curl -X GET http://localhost:8080/api/auth/me \
     -H "Authorization: Bearer $TOKEN"

   # Logout
   curl -X POST http://localhost:8080/api/auth/logout \
     -H "Authorization: Bearer $TOKEN"

   # Client should now remove token
   # Token technically still works on server (stateless)
   ```

2. **Multiple Logouts**:
   ```bash
   # Should all succeed
   curl -X POST http://localhost:8080/api/auth/logout
   curl -X POST http://localhost:8080/api/auth/logout
   curl -X POST http://localhost:8080/api/auth/logout
   ```

3. **Logout Without Token**:
   ```bash
   # Should still succeed
   curl -X POST http://localhost:8080/api/auth/logout
   ```

## Troubleshooting

### Issue: Token still works after logout
- This is expected behavior with stateless JWT tokens
- Client must remove the token from storage
- Consider implementing token blacklisting for better security

### Issue: User not redirected after logout
- Check client-side redirect logic
- Ensure token removal is happening
- Verify navigation/redirect code is executing

### Issue: Logout fails on client but succeeds on server
- Implement proper error handling
- Always clear tokens in finally block
- Show user feedback even on partial failures
