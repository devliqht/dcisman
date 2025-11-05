# Leaderboard API

## Get All Leaderboards

Get all leaderboards (high score, highest level, total ghosts) in a single request.

### Request

```bash
curl -X GET "http://localhost:8080/api/leaderboard?limit=10"
```

### Query Parameters

- `limit` (optional) - Number of entries to return per leaderboard (default: 10)

### Response (200 OK)

```json
[
  {
    "category": "HIGH_SCORE",
    "entries": [
      {
        "userId": 1,
        "username": "player1",
        "value": 50000,
        "rank": 1
      },
      {
        "userId": 2,
        "username": "player2",
        "value": 45000,
        "rank": 2
      }
    ],
    "lastUpdated": "2025-01-15T10:30:00",
    "totalPlayers": 100
  },
  {
    "category": "HIGHEST_LEVEL",
    "entries": [
      {
        "userId": 3,
        "username": "player3",
        "value": 10,
        "rank": 1
      }
    ],
    "lastUpdated": "2025-01-15T10:30:00",
    "totalPlayers": 100
  },
  {
    "category": "TOTAL_GHOSTS",
    "entries": [
      {
        "userId": 1,
        "username": "player1",
        "value": 500,
        "rank": 1
      }
    ],
    "lastUpdated": "2025-01-15T10:30:00",
    "totalPlayers": 100
  }
]
```

## Get High Score Leaderboard

Get the leaderboard for highest scores.

### Request

```bash
curl -X GET "http://localhost:8080/api/leaderboard/high-score?limit=10"
```

### Query Parameters

- `limit` (optional) - Number of entries to return (default: 10)

### Response (200 OK)

```json
{
  "category": "HIGH_SCORE",
  "entries": [
    {
      "userId": 1,
      "username": "player1",
      "value": 50000,
      "rank": 1
    },
    {
      "userId": 2,
      "username": "player2",
      "value": 45000,
      "rank": 2
    },
    {
      "userId": 3,
      "username": "player3",
      "value": 40000,
      "rank": 3
    }
  ],
  "lastUpdated": "2025-01-15T10:30:00",
  "totalPlayers": 100
}
```

## Get Highest Level Leaderboard

Get the leaderboard for highest levels reached.

### Request

```bash
curl -X GET "http://localhost:8080/api/leaderboard/highest-level?limit=10"
```

### Query Parameters

- `limit` (optional) - Number of entries to return (default: 10)

### Response (200 OK)

```json
{
  "category": "HIGHEST_LEVEL",
  "entries": [
    {
      "userId": 3,
      "username": "player3",
      "value": 10,
      "rank": 1
    },
    {
      "userId": 1,
      "username": "player1",
      "value": 8,
      "rank": 2
    }
  ],
  "lastUpdated": "2025-01-15T10:30:00",
  "totalPlayers": 100
}
```

## Get Total Ghosts Leaderboard

Get the leaderboard for total ghosts eaten.

### Request

```bash
curl -X GET "http://localhost:8080/api/leaderboard/total-ghosts?limit=10"
```

### Query Parameters

- `limit` (optional) - Number of entries to return (default: 10)

### Response (200 OK)

```json
{
  "category": "TOTAL_GHOSTS",
  "entries": [
    {
      "userId": 1,
      "username": "player1",
      "value": 500,
      "rank": 1
    },
    {
      "userId": 2,
      "username": "player2",
      "value": 450,
      "rank": 2
    }
  ],
  "lastUpdated": "2025-01-15T10:30:00",
  "totalPlayers": 100
}
```

## Response Fields

### LeaderboardResponse
- `category` - Category type (HIGH_SCORE, HIGHEST_LEVEL, TOTAL_GHOSTS)
- `entries` - Array of leaderboard entries
- `lastUpdated` - Timestamp when data was fetched
- `totalPlayers` - Total number of players with stats

### LeaderboardEntry
- `userId` - User's ID
- `username` - User's username
- `value` - The stat value (score, level, or ghosts)
- `rank` - Player's rank (1-based)

## Notes

- Leaderboards do not require authentication
- Entries are sorted in descending order by value
- The `limit` parameter controls how many top entries are returned
- Rankings are calculated based on the order of entries
- The `lastUpdated` field reflects when the query was executed
- Empty leaderboards will return an empty `entries` array
