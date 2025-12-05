# API Documentation

## Authentication

All API routes require authentication via NextAuth session cookie.

---

## Endpoints

### `POST /api/chat`

Streams a chat response from the AI model.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "Hello" },
    { "role": "assistant", "content": "Hi there!" },
    { "role": "user", "content": "Who am I?" }
  ]
}
```

**Behavior:**
1. Detects if request is a regeneration (same last user message exists in DB)
2. For regenerations: deletes previous assistant response and its feedback
3. For new messages: saves user message to database
4. Checks for personality trigger phrases ("who am i", "tell me about myself", etc.)
5. Fetches conversation history with feedback data
6. Builds system prompt with:
   - Personality analysis instructions (if triggered)
   - Feedback context (liked/disliked response examples)
7. Streams response from OpenAI GPT-4
8. Saves assistant response to database

**Personality Triggers:**
- "who am i"
- "tell me about myself"
- "my personality"
- "analyze me"
- "what do you think of me"
- "describe me"
- "what have you learned about me"
- "profile me"

**Response:** Server-Sent Events (SSE) stream of text

---

### `POST /api/feedback`

Saves or updates feedback for an AI message.

**Request Body:**
```json
{
  "messageId": "cuid-string",
  "content": "message content (fallback lookup)",
  "rating": "up" | "down"
}
```

**Behavior:**
- Looks up message by ID first, falls back to content matching
- Creates new feedback or updates existing
- Feedback is used in subsequent AI prompts

**Response:**
```json
{ "success": true, "feedback": { "id": "...", "rating": "up" } }
```

---

### `DELETE /api/feedback`

Removes feedback for a message.

**Request Body:**
```json
{
  "messageId": "cuid-string",
  "content": "message content (fallback lookup)"
}
```

**Response:**
```json
{ "success": true }
```

---

### `GET /api/auth/*`

NextAuth.js authentication endpoints (SignIn, SignOut, Session).

---

## Database Schema

```prisma
model User {
  id            String         @id
  email         String?        @unique
  password      String?
  conversations Conversation[]
}

model Conversation {
  id       String    @id
  userId   String
  messages Message[]
}

model Message {
  id             String    @id
  conversationId String
  role           String    // 'user' | 'assistant'
  content        String
  feedback       Feedback?
}

model Feedback {
  id        String @id
  messageId String @unique
  rating    String // 'up' | 'down'
}
```
