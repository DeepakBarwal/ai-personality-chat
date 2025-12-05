# AI Personality Chat

A Next.js AI Chatbot that learns from your conversations and can generate a personality profile on demand.

## Features

- **Chat Interface**: Real-time streaming chat with an AI assistant.
- **Persistence**: Stores conversation history in a database (SQLite/Postgres).
- **Personality Analysis**: Ask "Who am I?" to get a psychological profile based on your chat history.
- **Authentication**: Secure login with NextAuth.js.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Prisma ORM (SQLite for dev)
- **Auth**: NextAuth.js v5
- **AI**: Vercel AI SDK + OpenAI

## Setup

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Setup**:
    Create a `.env` file with:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/ai_chat_db?schema=public"
    AUTH_SECRET="your-secret-key"
    OPENAI_API_KEY="sk-..."
    ```
4.  **Database Setup**:
    ```bash
    npx prisma migrate dev --name init
    npx tsx prisma/seed.ts
    ```
5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Demo Credentials

- **Email**: `demo@example.com`
- **Password**: `password123`

## Testing

Run unit tests:
```bash
npm test
# or
npx vitest run
```
