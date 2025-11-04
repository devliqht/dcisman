# Health Check Endpoint

## Endpoint Details

- **URL**: `/api/health`
- **Method**: `GET`
- **Authentication Required**: No
- **Content-Type**: N/A (no request body)

## Description

A simple health check endpoint to verify that the API server is running and responding to requests. This is useful for monitoring, load balancers, and verifying the deployment status.

## Request Example

```bash
GET /api/health HTTP/1.1
Host: localhost:8080
```

## Success Response

### Status Code
`200 OK`

### Response Body

```json
{
  "status": "UP"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Health status of the API (always "UP" when responding) |

## Error Scenarios

### 1. Server Not Running

**Scenario**: Backend server is not running

**Request**:
```bash
curl http://localhost:8080/api/health
```

**Response**:
```
curl: (7) Failed to connect to localhost port 8080: Connection refused
```

**HTTP Status**: No response (connection failed)

### 2. Network Issues

**Scenario**: Network connectivity problems

**Response**:
```
curl: (6) Could not resolve host: localhost
```

or

```
curl: (28) Connection timed out after 30000 milliseconds
```

### 3. Wrong Port

**Scenario**: Connecting to wrong port

**Request**:
```bash
curl http://localhost:8081/api/health
```

**Response**:
```
curl: (7) Failed to connect to localhost port 8081: Connection refused
```

### 4. Wrong Endpoint Path

**Scenario**: Using incorrect path

**Request**:
```bash
curl http://localhost:8080/api/health-check
```

**Response**:
```json
{
  "status": 404,
  "error": "Not Found",
  "path": "/api/health-check"
}
```

**HTTP Status**: `404 Not Found`

## cURL Examples

### Basic Health Check

```bash
curl http://localhost:8080/api/health
```

### With HTTP Status Code

```bash
curl -w "\nHTTP Status: %{http_code}\n" http://localhost:8080/api/health
```

### With Timing Information

```bash
curl -w "\nTime Total: %{time_total}s\n" http://localhost:8080/api/health
```

### Verbose Output

```bash
curl -v http://localhost:8080/api/health
```

### Silent Mode (Only Exit Code)

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/health
```

### With Timeout

```bash
curl --max-time 5 http://localhost:8080/api/health
```

### Production Environment

```bash
curl https://dcisman.gdgoc.tech/api/health
```

### With Pretty JSON Output

```bash
curl http://localhost:8080/api/health | python3 -m json.tool
```

## Testing Checklist

- [ ] Health check returns 200 OK
- [ ] Response contains "status": "UP"
- [ ] Response time is acceptable (< 100ms typically)
- [ ] Works without authentication
- [ ] Works from different networks (if applicable)
- [ ] Works via HTTP and HTTPS (production)
- [ ] Load balancer can reach the endpoint
- [ ] Monitoring tools can parse the response

## Monitoring Script Examples

### Simple Health Check Script

```bash
#!/bin/bash
# health-check.sh

ENDPOINT="http://localhost:8080/api/health"

response=$(curl -s -o /dev/null -w "%{http_code}" $ENDPOINT)

if [ "$response" -eq 200 ]; then
    echo "✓ API is healthy"
    exit 0
else
    echo "✗ API is unhealthy (HTTP $response)"
    exit 1
fi
```

### Continuous Monitoring

```bash
#!/bin/bash
# monitor-health.sh

ENDPOINT="http://localhost:8080/api/health"
INTERVAL=30  # seconds

while true; do
    timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 $ENDPOINT 2>&1)

    if [ "$response" -eq 200 ]; then
        echo "[$timestamp] ✓ Healthy"
    else
        echo "[$timestamp] ✗ Unhealthy - Status: $response"
        # Send alert (email, SMS, Slack, etc.)
    fi

    sleep $INTERVAL
done
```

### Health Check with Retry

```bash
#!/bin/bash
# health-check-retry.sh

ENDPOINT="http://localhost:8080/api/health"
MAX_RETRIES=3
RETRY_DELAY=2

for i in $(seq 1 $MAX_RETRIES); do
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 $ENDPOINT)

    if [ "$response" -eq 200 ]; then
        echo "✓ API is healthy (attempt $i)"
        exit 0
    fi

    echo "Attempt $i failed, retrying in ${RETRY_DELAY}s..."
    sleep $RETRY_DELAY
done

echo "✗ API is unhealthy after $MAX_RETRIES attempts"
exit 1
```

### Advanced Monitoring with Response Time

```bash
#!/bin/bash
# health-check-detailed.sh

ENDPOINT="http://localhost:8080/api/health"
MAX_RESPONSE_TIME=1.0  # seconds

result=$(curl -s -w "\n%{http_code}\n%{time_total}" -o /tmp/health-response.json $ENDPOINT)
body=$(cat /tmp/health-response.json)
http_code=$(echo "$result" | sed -n '2p')
time_total=$(echo "$result" | sed -n '3p')

echo "Response: $body"
echo "HTTP Code: $http_code"
echo "Response Time: ${time_total}s"

if [ "$http_code" -eq 200 ]; then
    if (( $(echo "$time_total < $MAX_RESPONSE_TIME" | bc -l) )); then
        echo "✓ API is healthy and responsive"
        exit 0
    else
        echo "⚠ API is healthy but slow (>${MAX_RESPONSE_TIME}s)"
        exit 1
    fi
else
    echo "✗ API is unhealthy"
    exit 1
fi
```

## Integration with Monitoring Tools

### Prometheus/Grafana

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'dcisman-api'
    metrics_path: '/api/health'
    static_configs:
      - targets: ['localhost:8080']
```

### Docker Health Check

```dockerfile
# Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1
```

### Kubernetes Liveness Probe

```yaml
# deployment.yaml
apiVersion: v1
kind: Pod
metadata:
  name: dcisman-backend
spec:
  containers:
  - name: backend
    image: dcisman-backend:latest
    livenessProbe:
      httpGet:
        path: /api/health
        port: 8080
      initialDelaySeconds: 30
      periodSeconds: 10
      timeoutSeconds: 5
      failureThreshold: 3
    readinessProbe:
      httpGet:
        path: /api/health
        port: 8080
      initialDelaySeconds: 5
      periodSeconds: 5
      timeoutSeconds: 3
      failureThreshold: 3
```

### Nginx Load Balancer Health Check

```nginx
# nginx.conf
upstream backend {
    server localhost:8080 max_fails=3 fail_timeout=30s;

    # Health check (requires nginx plus or nginx-healthcheck module)
    health_check interval=10s uri=/api/health;
}
```

### Systemd Service Check

```bash
# /etc/systemd/system/dcisman-healthcheck.service
[Unit]
Description=DCISMan API Health Check
After=dcisman.service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/health-check.sh
```

```bash
# /etc/systemd/system/dcisman-healthcheck.timer
[Unit]
Description=Run DCISMan health check every minute

[Timer]
OnBootSec=1min
OnUnitActiveSec=1min

[Install]
WantedBy=timers.target
```

## Use Cases

### 1. Verify Server is Running

```bash
# Quick check before starting work
curl http://localhost:8080/api/health && echo "Server is ready"
```

### 2. CI/CD Pipeline Health Check

```bash
# In CI/CD script
echo "Waiting for server to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8080/api/health > /dev/null; then
        echo "✓ Server is ready"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done
```

### 3. Load Balancer Backend Check

```bash
# Check all backend servers
for server in backend1 backend2 backend3; do
    status=$(curl -s -o /dev/null -w "%{http_code}" http://$server:8080/api/health)
    echo "$server: $status"
done
```

### 4. Deployment Verification

```bash
# After deployment
echo "Verifying deployment..."
sleep 5  # Wait for server to start

if curl -s http://localhost:8080/api/health | grep -q "UP"; then
    echo "✓ Deployment successful"
else
    echo "✗ Deployment failed"
    exit 1
fi
```

## Related Endpoints

- [Register](./register.md) - `/api/auth/register` - Create user account
- [Login](./login.md) - `/api/auth/login` - User authentication
- [Get Current User](./me.md) - `/api/auth/me` - Get user info
- [Logout](./logout.md) - `/api/auth/logout` - Logout user

## Best Practices

1. **Regular Monitoring**:
   - Check health endpoint every 30-60 seconds
   - Alert if unhealthy for > 2 consecutive checks
   - Track response times for performance trends

2. **Timeout Configuration**:
   - Set reasonable timeouts (3-5 seconds)
   - Don't wait indefinitely for response
   - Fail fast and retry

3. **Retry Logic**:
   - Implement exponential backoff
   - Don't overwhelm a struggling server
   - Set maximum retry attempts

4. **Logging**:
   - Log all health check failures
   - Include timestamp and error details
   - Monitor for patterns

5. **Alerting**:
   - Alert on multiple consecutive failures
   - Include server location and timestamp
   - Set up escalation policies

## Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Server is healthy | No action needed |
| 5xx | Server error | Investigate logs, restart if needed |
| No response | Server down | Start/restart server |
| Timeout | Server overloaded | Check resources, scale if needed |

## Performance Expectations

- **Response Time**: < 100ms typical
- **Availability**: > 99.9% uptime target
- **Max Response Time**: < 1 second acceptable
- **Timeout**: 3-5 seconds recommended

## Troubleshooting

### Issue: Connection Refused
**Cause**: Server is not running
**Solution**: Start the Spring Boot application

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Issue: Slow Response
**Cause**: Server is overloaded or has performance issues
**Solution**:
- Check server resources (CPU, memory)
- Review application logs
- Scale horizontally if needed

### Issue: 404 Not Found
**Cause**: Wrong endpoint path or server misconfiguration
**Solution**:
- Verify endpoint path is `/api/health`
- Check server routing configuration
- Review Spring Security configuration

### Issue: CORS Error (Browser)
**Cause**: CORS not configured for the origin
**Solution**: Add origin to CORS configuration in SecurityConfig

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "http://localhost:5174",
    "https://dcisman.gdgoc.tech"
));
```

## Notes

- **No Authentication**: This endpoint is public and doesn't require authentication
- **Lightweight**: Designed to be fast and lightweight
- **Monitoring**: Intended for automated health monitoring
- **Load Balancers**: Used by load balancers to determine backend health
- **Future Enhancements**: Could include database connectivity checks, disk space, etc.

## Future Enhancements

### Detailed Health Information

```json
{
  "status": "UP",
  "timestamp": "2025-11-04T21:57:26Z",
  "components": {
    "database": {
      "status": "UP",
      "responseTime": "15ms"
    },
    "diskSpace": {
      "status": "UP",
      "free": "50GB",
      "threshold": "10GB"
    },
    "memory": {
      "status": "UP",
      "used": "512MB",
      "max": "2GB"
    }
  },
  "version": "1.0.0"
}
```

### Authenticated Health Endpoint

```bash
# Detailed health info (admin only)
curl -X GET http://localhost:8080/api/health/details \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Health Check Levels

```bash
# Quick check (current)
curl http://localhost:8080/api/health

# Deep check (database, external services, etc.)
curl http://localhost:8080/api/health/deep

# Readiness check (ready to accept traffic)
curl http://localhost:8080/api/health/ready

# Liveness check (still alive, restart if fails)
curl http://localhost:8080/api/health/live
```
