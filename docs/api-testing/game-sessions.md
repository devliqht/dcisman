# Game Sessions API

Endpoints for managing game sessions, including starting, updating, and ending games.

## Authentication

All game session endpoints require a valid JWT token. Include it in the request headers:

```
Authorization: Bearer <your_jwt_token>
```

---

## Start Game Session

Create a new game session for the authenticated user. Any existing in-progress sessions will be automatically abandoned.

### Request

```bash
POST /api/game-sessions/start
Content-Type: application/json
Authorization: Bearer <token>

{}
```

**Request Body:** Empty object (optional)

### Response

**Success (201 Created):**
```json
{
  "id": 1,
  "userId": 5,
  "username": "player1",
  "score": 0,
  "levelReached": 1,
  "durationSeconds": 0,
  "ghostsEaten": 0,
  "powerUpsUsed": 0,
  "status": "IN_PROGRESS",
  "startedAt": "2025-11-05T15:30:00",
  "endedAt": null
}
```

**Error (400 Bad Request):**
```json
{
  "message": "Error message"
}
```

### cURL Example

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:8080/api/game-sessions/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}'
```

---

## Update Game Session

Update statistics for an in-progress game session. Used for periodic updates during gameplay.

### Request

```bash
PUT /api/game-sessions/{sessionId}
Content-Type: application/json
Authorization: Bearer <token>

{
  "score": 1500,
  "levelReached": 2,
  "durationSeconds": 120,
  "ghostsEaten": 5,
  "powerUpsUsed": 3
}
```

**Path Parameters:**
- `sessionId` (required) - The ID of the game session to update

**Request Body:**
- `score` (optional) - Current score
- `levelReached` (optional) - Current level reached
- `durationSeconds` (optional) - Game duration in seconds
- `ghostsEaten` (optional) - Total ghosts eaten
- `powerUpsUsed` (optional) - Total power-ups consumed

### Response

**Success (200 OK):**
```json
{
  "id": 1,
  "userId": 5,
  "username": "player1",
  "score": 1500,
  "levelReached": 2,
  "durationSeconds": 120,
  "ghostsEaten": 5,
  "powerUpsUsed": 3,
  "status": "IN_PROGRESS",
  "startedAt": "2025-11-05T15:30:00",
  "endedAt": null
}
```

**Error (400 Bad Request):**
```json
{
  "message": "Cannot update a session that is not in progress"
}
```

**Error (404 Not Found):**
```json
{
  "message": "Game session not found"
}
```

### cURL Example

```bash
TOKEN="your_jwt_token_here"
SESSION_ID=1

curl -X PUT http://localhost:8080/api/game-sessions/$SESSION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "score": 1500,
    "levelReached": 2,
    "durationSeconds": 120,
    "ghostsEaten": 5,
    "powerUpsUsed": 3
  }'
```

---

## End Game Session

Mark a game session as completed or abandoned with final statistics.

### Request

```bash
POST /api/game-sessions/{sessionId}/end
Content-Type: application/json
Authorization: Bearer <token>

{
  "score": 2500,
  "levelReached": 3,
  "durationSeconds": 300,
  "ghostsEaten": 12,
  "powerUpsUsed": 8,
  "status": "COMPLETED"
}
```

**Path Parameters:**
- `sessionId` (required) - The ID of the game session to end

**Request Body:**
- `score` (required) - Final score
- `levelReached` (required) - Final level reached
- `durationSeconds` (required) - Total game duration in seconds
- `ghostsEaten` (required) - Total ghosts eaten
- `powerUpsUsed` (required) - Total power-ups consumed
- `status` (required) - Either "COMPLETED" or "ABANDONED"

### Response

**Success (200 OK):**
```json
{
  "id": 1,
  "userId": 5,
  "username": "player1",
  "score": 2500,
  "levelReached": 3,
  "durationSeconds": 300,
  "ghostsEaten": 12,
  "powerUpsUsed": 8,
  "status": "COMPLETED",
  "startedAt": "2025-11-05T15:30:00",
  "endedAt": "2025-11-05T15:35:00"
}
```

**Error (400 Bad Request):**
```json
{
  "message": "Session is already ended"
}
```

**Error (404 Not Found):**
```json
{
  "message": "Game session not found"
}
```

### cURL Examples

**Completed Game:**
```bash
TOKEN="your_jwt_token_here"
SESSION_ID=1

curl -X POST http://localhost:8080/api/game-sessions/$SESSION_ID/end \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "score": 2500,
    "levelReached": 3,
    "durationSeconds": 300,
    "ghostsEaten": 12,
    "powerUpsUsed": 8,
    "status": "COMPLETED"
  }'
```

**Abandoned Game:**
```bash
curl -X POST http://localhost:8080/api/game-sessions/$SESSION_ID/end \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "score": 500,
    "levelReached": 1,
    "durationSeconds": 45,
    "ghostsEaten": 2,
    "powerUpsUsed": 1,
    "status": "ABANDONED"
  }'
```

---

## Get User Sessions

Retrieve all game sessions for the authenticated user, ordered by most recent first.

### Request

```bash
GET /api/game-sessions
Authorization: Bearer <token>
```

### Response

**Success (200 OK):**
```json
[
  {
    "id": 3,
    "userId": 5,
    "username": "player1",
    "score": 2500,
    "levelReached": 3,
    "durationSeconds": 300,
    "ghostsEaten": 12,
    "powerUpsUsed": 8,
    "status": "COMPLETED",
    "startedAt": "2025-11-05T15:30:00",
    "endedAt": "2025-11-05T15:35:00"
  },
  {
    "id": 2,
    "userId": 5,
    "username": "player1",
    "score": 1200,
    "levelReached": 2,
    "durationSeconds": 180,
    "ghostsEaten": 6,
    "powerUpsUsed": 4,
    "status": "ABANDONED",
    "startedAt": "2025-11-05T14:00:00",
    "endedAt": "2025-11-05T14:03:00"
  }
]
```

**Empty List:**
```json
[]
```

### cURL Example

```bash
TOKEN="your_jwt_token_here"

curl http://localhost:8080/api/game-sessions \
  -H "Authorization: Bearer $TOKEN"
```

---

## Get Specific Session

Retrieve details of a specific game session by ID.

### Request

```bash
GET /api/game-sessions/{sessionId}
Authorization: Bearer <token>
```

**Path Parameters:**
- `sessionId` (required) - The ID of the game session

### Response

**Success (200 OK):**
```json
{
  "id": 1,
  "userId": 5,
  "username": "player1",
  "score": 2500,
  "levelReached": 3,
  "durationSeconds": 300,
  "ghostsEaten": 12,
  "powerUpsUsed": 8,
  "status": "COMPLETED",
  "startedAt": "2025-11-05T15:30:00",
  "endedAt": "2025-11-05T15:35:00"
}
```

**Error (404 Not Found):**
```json
{
  "message": "Game session not found"
}
```

### cURL Example

```bash
TOKEN="your_jwt_token_here"
SESSION_ID=1

curl http://localhost:8080/api/game-sessions/$SESSION_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Get Active Session

Retrieve the current in-progress game session for the authenticated user.

### Request

```bash
GET /api/game-sessions/active
Authorization: Bearer <token>
```

### Response

**Success (200 OK):**
```json
{
  "id": 1,
  "userId": 5,
  "username": "player1",
  "score": 800,
  "levelReached": 1,
  "durationSeconds": 60,
  "ghostsEaten": 3,
  "powerUpsUsed": 2,
  "status": "IN_PROGRESS",
  "startedAt": "2025-11-05T15:30:00",
  "endedAt": null
}
```

**Error (404 Not Found):**
```json
{
  "message": "No active game session found"
}
```

### cURL Example

```bash
TOKEN="your_jwt_token_here"

curl http://localhost:8080/api/game-sessions/active \
  -H "Authorization: Bearer $TOKEN"
```

---

## Game Session Status Values

- **IN_PROGRESS** - Game is currently being played
- **COMPLETED** - Game ended normally (player lost all lives or quit)
- **ABANDONED** - Game was interrupted (user closed browser, started new game, etc.)

---

## Notes

- Sessions are automatically updated every 5 seconds during gameplay
- Starting a new game automatically abandons any existing in-progress sessions
- Only the session owner can view and update their sessions
- Duration is tracked in seconds for accurate timing
- All timestamps are in ISO 8601 format