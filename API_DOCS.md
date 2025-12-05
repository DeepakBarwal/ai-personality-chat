# API Documentation

## Authentication

All API routes require authentication via NextAuth session cookie.

## Endpoints

### `POST /api/chat`

Streams a chat response from the AI model.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello" }
  ]
}
```

**Behavior:**
- Detects if request is a regeneration (same last user message)
- For regenerations: deletes previous assistant response and its feedback
- For new messages: saves user message to database
- Retrieves recent conversation history with feedback
- Includes feedback context in AI prompt (liked/disliked examples)
- Checks if message triggers "Personality Profile" (e.g., "Who am I?")
- Streams response (either normal chat or profile analysis)
- Saves assistant response to database

**Response:**
- Server-Sent Events (SSE) stream of text

---

### `POST /api/feedback`

Saves feedback for an AI message.

**Request Body:**
```json
{
  "messageId": "cuid",
  "content": "message content for lookup fallback",
  "rating": "up" | "down"
}
```

**Behavior:**
- Looks up message by ID, falls back to content matching
- Creates or updates feedback entry
- Used to train AI on user preferences

**Response:**
```json
{ "success": true, "feedback": {...} }
```

---

### `DELETE /api/feedback`

Removes feedback for a message.

**Request Body:**
```json
{
  "messageId": "cuid",
  "content": "message content for lookup fallback"
}
```

**Response:**
```json
{ "success": true }
```

---

### `GET /api/auth/*`

NextAuth.js authentication endpoints (SignIn, SignOut, Session).
