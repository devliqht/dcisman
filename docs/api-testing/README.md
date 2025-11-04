# API Testing Guide

This directory contains comprehensive testing guides for all DCISMan API endpoints.

## Overview

The DCISMan backend provides a REST API for user authentication and game functionality. This guide covers all available endpoints, their usage, expected responses, and error scenarios.

## Base URL

- **Local Development**: `http://localhost:8080/api`
- **Production**: `https://dcisman.gdgoc.tech/api`

## Available Endpoints

### Authentication Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/auth/register` | POST | Register a new user | No |
| `/auth/login` | POST | Login with credentials | No |
| `/auth/me` | GET | Get current user information | Yes |
| `/auth/logout` | POST | Logout user | No |

### Health Check Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/health` | GET | Check API health status | No |

## Detailed Endpoint Documentation

Each endpoint has its own detailed testing guide:

1. [Register User](./register.md) - `/api/auth/register`
2. [Login User](./login.md) - `/api/auth/login`
3. [Get Current User](./me.md) - `/api/auth/me`
4. [Logout User](./logout.md) - `/api/auth/logout`
5. [Health Check](./health.md) - `/api/health`

## Authentication

The API uses JWT (JSON Web Token) for authentication. After successful login or registration, you'll receive a token in the response.

### Using JWT Token

Include the token in the `Authorization` header for protected endpoints:

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration

- JWT tokens expire after **24 hours** (86400000 milliseconds)
- When a token expires, you'll receive a 401 Unauthorized response
- You'll need to login again to get a new token

## Common Response Formats

### Success Response Format

Most successful requests return JSON with relevant data:

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "role": "USER"
}
```

### Error Response Format

Errors return a consistent format:

```json
{
  "message": "Error description here"
}
```

Or for validation errors:

```json
{
  "status": 400,
  "message": "Detailed error message",
  "timestamp": "2025-11-04T21:57:26"
}
```

## Testing Tools

### cURL Examples

All endpoint guides include cURL examples for easy testing from the command line.

### Postman Collection

You can import these endpoints into Postman for easier testing. See [Postman Setup Guide](./postman-setup.md) (coming soon).

## Common HTTP Status Codes

| Status Code | Meaning | When It Occurs |
|-------------|---------|----------------|
| 200 OK | Success | Successful GET, POST, PUT requests |
| 201 Created | Resource created | Successful user registration |
| 400 Bad Request | Invalid input | Validation errors, malformed requests |
| 401 Unauthorized | Not authenticated | Missing/invalid JWT token, wrong credentials |
| 404 Not Found | Resource not found | Endpoint doesn't exist, user not found |
| 500 Internal Server Error | Server error | Unexpected server errors |

## Environment Setup

### Local Testing

1. Ensure MySQL is running (XAMPP)
2. Start the Spring Boot backend:
   ```bash
   cd backend
   mvn spring-boot:run -Dspring-boot.run.profiles=local
   ```
3. API will be available at `http://localhost:8080/api`

### Production Testing

1. API is available at `https://dcisman.gdgoc.tech/api`
2. Ensure you're using HTTPS for all requests
3. CORS is configured for the production domain

## Quick Start Testing

1. **Check if API is running**:
   ```bash
   curl http://localhost:8080/api/health
   ```

2. **Register a test user**:
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
   ```

3. **Login with the test user**:
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"usernameOrEmail": "testuser", "password": "password123"}'
   ```

4. **Access protected endpoint**:
   ```bash
   TOKEN="your_jwt_token_here"
   curl -X GET http://localhost:8080/api/auth/me \
     -H "Authorization: Bearer $TOKEN"
   ```

## Troubleshooting

### Connection Refused
- Check if the backend server is running
- Verify the port (8080) is not blocked by firewall
- Ensure MySQL is running

### 401 Unauthorized
- Verify JWT token is valid and not expired
- Check Authorization header format: `Bearer <token>`
- Ensure token was obtained from login/register

### 400 Bad Request
- Check request body format (must be valid JSON)
- Verify all required fields are present
- Check field validation rules

### CORS Errors
- Verify your origin is in the allowed origins list
- Check CORS headers in the response
- Ensure credentials are being sent if required

## Support

For issues or questions:
1. Check the specific endpoint documentation
2. Review the troubleshooting section
3. Check server logs for detailed error messages
4. Refer to Phase 2 documentation: `/phases/PHASE_2.md`
