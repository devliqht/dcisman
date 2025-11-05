# Stats API

## Get Current User Stats

Get statistics for the currently authenticated user.

### Request

```bash
curl -X GET http://localhost:8080/api/stats/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response (200 OK)

```json
{
  "id": 1,
  "userId": 42,
  "highestScore": 15000,
  "totalGhostsEaten": 234,
  "longestTimePlayed": 1200,
  "totalPowerUpsUsed": 45,
  "highestLevelReached": 5,
  "totalGamesPlayed": 50,
  "totalGamesCompleted": 30,
  "createdAt": "2025-01-15T10:30:00",
  "updatedAt": "2025-01-15T15:45:00"
}
```

### Response Fields

- `id` - Stats record ID
- `userId` - User ID
- `highestScore` - Highest score achieved across all games
- `totalGhostsEaten` - Total number of ghosts eaten in all games
- `longestTimePlayed` - Longest game duration in seconds
- `totalPowerUpsUsed` - Total power-ups used across all games
- `highestLevelReached` - Highest level reached in any game
- `totalGamesPlayed` - Total number of games played (including abandoned)
- `totalGamesCompleted` - Total number of games completed successfully
- `createdAt` - When the stats record was created
- `updatedAt` - When the stats were last updated

### Error Responses

#### 401 Unauthorized
```json
{
  "timestamp": "2025-01-15T10:30:00",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required",
  "path": "/api/stats/me"
}
```

#### 404 Not Found
```json
{
  "timestamp": "2025-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "User stats not found for user ID: 42",
  "path": "/api/stats/me"
}
```

## Get User Stats by ID

Get statistics for a specific user by their ID.

### Request

```bash
curl -X GET http://localhost:8080/api/stats/user/42 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Response (200 OK)

Same format as "Get Current User Stats"

### Error Responses

Same as "Get Current User Stats"

## Notes

- Stats are automatically created when a user first completes a game session
- Stats are updated after each game session ends (both completed and abandoned)
- The `longestTimePlayed` field tracks the longest single game session in seconds
- Stats persist across all game sessions for a user
- The highest values are tracked (score, level) while totals are accumulated (ghosts, power-ups)
