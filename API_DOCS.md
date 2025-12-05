# API Documentation

## Interactive Documentation

📚 **Scalar API Docs**: [http://localhost:3000/docs](http://localhost:3000/docs)

The interactive API explorer provides:
- Dark mode UI
- Try-it-out requests
- Request/response examples
- Schema definitions

---

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
4. Checks for personality trigger phrases
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
  id            String         @id @default(cuid())
  name          String?
  email         String?        @unique
  password      String?
  conversations Conversation[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Conversation {
  id        String    @id @default(cuid())
  userId    String
  user      User      @relation(...)
  messages  Message[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Message {
  id             String       @id @default(cuid())
  conversationId String
  conversation   Conversation @relation(...)
  role           String       // 'user' | 'assistant'
  content        String
  feedback       Feedback?
  createdAt      DateTime     @default(now())
}

model Feedback {
  id        String   @id @default(cuid())
  messageId String   @unique
  message   Message  @relation(...)
  rating    String   // 'up' | 'down'
  createdAt DateTime @default(now())
}
```

---

## Error Responses

| Status | Description |
|--------|-------------|
| 401 | Unauthorized - No valid session |
| 400 | Bad request - Invalid input |
| 404 | User or Message not found |
| 500 | Internal server error |

---

## OpenAPI Specification

The full OpenAPI 3.1 specification is available at:
- **JSON**: `/openapi.json`
- **Interactive**: `/docs`
