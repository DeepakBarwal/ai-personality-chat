# AI Personality Chat

A Next.js AI Chatbot that learns from your conversations and can generate a personality profile on demand.

## Features

- **Chat Interface**: Real-time streaming chat with a modern dark UI
- **Persistence**: Stores conversation history in PostgreSQL
- **Personality Analysis**: Ask "Who am I?" to get a psychological profile
- **Feedback System**: 👍/👎 responses to train the AI on your preferences
- **Response Regeneration**: Regenerate AI responses with automatic cleanup
- **Markdown Rendering**: AI responses render with full markdown support
- **Authentication**: Secure login with NextAuth.js

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Prisma ORM + PostgreSQL
- **Auth**: NextAuth.js v5
- **AI**: Vercel AI SDK + OpenAI GPT-4

## Setup

1. **Clone the repository**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file with:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ai_chat_db?schema=public"
   AUTH_SECRET="your-secret-key"
   OPENAI_API_KEY="sk-..."
   ```

4. **Database Setup**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Demo Credentials

- **Email**: `demo@example.com`
- **Password**: `password123`

## How Feedback Works

1. Chat with the AI and get responses
2. Use 👍 to mark helpful responses or 👎 for unhelpful ones
3. The AI incorporates your feedback into future responses
4. Regenerating a response automatically clears its feedback

## Testing

Run unit tests:
```bash
npm test
# or
npx vitest run
```
