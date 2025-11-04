# API Quick Reference Guide

A quick reference for all DCISMan API endpoints. For detailed documentation, see individual endpoint guides.

## Base URLs

- **Local**: `http://localhost:8080/api`
- **Production**: `https://dcisman.gdgoc.tech/api`

## Quick Command Reference

### Health Check
```bash
curl http://localhost:8080/api/health
```

### Register
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "testuser", "password": "password123"}'
```

### Get Current User (Protected)
```bash
TOKEN="your_jwt_token_here"
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Logout
```bash
curl -X POST http://localhost:8080/api/auth/logout
```

## Complete Testing Flow

```bash
# 1. Check if API is running
curl http://localhost:8080/api/health

# 2. Register a new user
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
  }')

# 3. Extract token from registration
TOKEN=$(echo $REGISTER_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# 4. Get user info with token
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# 5. Logout
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"

# 6. Login again
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "newuser",
    "password": "password123"
  }')

# 7. Extract new token
NEW_TOKEN=$(echo $LOGIN_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# 8. Verify new token works
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $NEW_TOKEN"
```

## Endpoints at a Glance

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/health` | GET | No | Check API status |
| `/auth/register` | POST | No | Create new user |
| `/auth/login` | POST | No | Authenticate user |
| `/auth/me` | GET | **Yes** | Get current user info |
| `/auth/logout` | POST | No | Logout user |

## Common Response Codes

| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful request |
| 201 | Created | User registered |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid token |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Server problem |

## Common Error Messages

### Registration
- `"Username is already taken"`
- `"Email is already registered"`
- `"Username must be between 3 and 50 characters"`
- `"Password must be between 6 and 100 characters"`
- `"Email must be valid"`

### Login
- `"Invalid username/email or password"`
- `"Account is inactive. Please contact support."`

### Protected Endpoints
- `"Unauthorized"` - Missing or invalid token

## Token Management

### Save Token After Login
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usernameOrEmail": "testuser", "password": "password123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")
```

### Use Token in Requests
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Export Token for Multiple Commands
```bash
export TOKEN="eyJhbGciOiJIUzUxMiJ9..."

# Now use $TOKEN in any command
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

## Testing Helpers

### Pretty Print JSON
```bash
curl http://localhost:8080/api/health | python3 -m json.tool
```

### Show HTTP Status Code
```bash
curl -w "\nStatus: %{http_code}\n" http://localhost:8080/api/health
```

### Show Response Time
```bash
curl -w "\nTime: %{time_total}s\n" http://localhost:8080/api/health
```

### Verbose Output (Debug)
```bash
curl -v http://localhost:8080/api/health
```

### Silent Mode
```bash
curl -s http://localhost:8080/api/health
```

## Database Verification

### Check Users Table
```bash
/Applications/XAMPP/bin/mysql -u root dcisman -e \
  "SELECT id, username, email, role, is_active, created_at FROM users;"
```

### Count Users
```bash
/Applications/XAMPP/bin/mysql -u root dcisman -e \
  "SELECT COUNT(*) as total_users FROM users;"
```

### Find Specific User
```bash
/Applications/XAMPP/bin/mysql -u root dcisman -e \
  "SELECT * FROM users WHERE username='testuser';"
```

## Environment-Specific Commands

### Local Development
```bash
BASE_URL="http://localhost:8080/api"
curl $BASE_URL/health
```

### Production
```bash
BASE_URL="https://dcisman.gdgoc.tech/api"
curl $BASE_URL/health
```

## Troubleshooting Quick Fixes

### Server Not Running
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Port Already in Use
```bash
lsof -ti:8080 | xargs kill -9
```

### MySQL Not Running (XAMPP)
```bash
sudo /Applications/XAMPP/xamppfiles/bin/mysql.server start
```

### Database Connection Error
```bash
# Verify database exists
/Applications/XAMPP/bin/mysql -u root -e "SHOW DATABASES LIKE 'dcisman';"
```

## Detailed Documentation

For complete documentation including all error scenarios, use cases, and examples:

- [Main Guide](./README.md) - Overview and setup
- [Health Check](./health.md) - `/api/health`
- [Register](./register.md) - `/api/auth/register`
- [Login](./login.md) - `/api/auth/login`
- [Get Current User](./me.md) - `/api/auth/me`
- [Logout](./logout.md) - `/api/auth/logout`

## Test Script Template

```bash
#!/bin/bash
# test-api.sh - Complete API test script

BASE_URL="http://localhost:8080/api"

echo "=== Testing DCISMan API ==="

# 1. Health Check
echo -e "\n1. Health Check"
curl -s $BASE_URL/health | python3 -m json.tool

# 2. Register
echo -e "\n2. Register New User"
REGISTER=$(curl -s -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser_'$(date +%s)'",
    "email": "test_'$(date +%s)'@example.com",
    "password": "password123"
  }')

echo $REGISTER | python3 -m json.tool
TOKEN=$(echo $REGISTER | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# 3. Get User Info
echo -e "\n3. Get Current User"
curl -s $BASE_URL/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool

# 4. Logout
echo -e "\n4. Logout"
curl -s -X POST $BASE_URL/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool

echo -e "\n=== Test Complete ==="
```

Make it executable:
```bash
chmod +x test-api.sh
./test-api.sh
```

## Common Workflows

### User Registration & Login Flow
```bash
# Register → Get Token → Use Token → Logout
```

### Token Refresh Flow (Future)
```bash
# Login → Use Token → Refresh Token → Continue Using
```

### Admin Operations (Future)
```bash
# Login as Admin → Get Admin Token → Perform Admin Actions
```

## Notes

- **Token Expiration**: JWT tokens expire after 24 hours
- **Password Security**: Passwords are hashed with BCrypt
- **CORS**: Configured for localhost and production domains
- **Rate Limiting**: Not implemented yet (future enhancement)
- **API Versioning**: Not implemented yet (all endpoints at `/api/*`)
