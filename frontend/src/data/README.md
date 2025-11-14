# Events Data

This directory contains event announcements that will be displayed in the Events modal.

## File Structure

- `events.json` - Array of event objects

## Event Object Schema

```json
{
  "id": "string",
  "title": "string",
  "dateRange": {
    "start": "YYYY-MM-DD",
    "end": "YYYY-MM-DD"
  },
  "description": "string (supports line breaks with \\n)",
  "author": "string",
  "publishedDate": "YYYY-MM-DD"
}
```

## Adding a New Event

1. Open `events.json`
2. Add a new event object to the array
3. Ensure the `id` is unique
4. Use proper date format (YYYY-MM-DD) for dates
5. Description supports basic text formatting with line breaks

## Example

```json
[
  {
    "id": "1",
    "title": "New Feature Announcement",
    "dateRange": {
      "start": "2025-01-15",
      "end": "2025-01-31"
    },
    "description": "We've added a new feature!\\n\\nCheck it out and let us know what you think.",
    "author": "Admin",
    "publishedDate": "2025-01-15"
  }
]
```

## Notes

- Events are displayed in the order they appear in the array
- Users can navigate between multiple events using arrow buttons
- The modal supports ESC key to close
- Description field supports multi-line text with `\n` for line breaks
