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
- Saves user message to database.
- Retrieves recent conversation history.
- Checks if message triggers "Personality Profile" (e.g., "Who am I?").
- Streams response (either normal chat or profile analysis).
- Saves assistant response to database.

**Response:**
- Server-Sent Events (SSE) stream of text.

### `GET /api/auth/*`

NextAuth.js authentication endpoints (SignIn, SignOut, Session).
