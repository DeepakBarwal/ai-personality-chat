# AI Personality Chat

A Next.js AI Chatbot that learns from your conversations and generates personality profiles on demand.

## ✨ Features

- **Real-time Streaming Chat** - Modern dark UI with live AI responses
- **Personality Profiles** - Ask "Who am I?" to get a detailed analysis based on your chat history
- **Feedback Learning** - Use 👍/👎 to train the AI on your preferences
- **Conversation Persistence** - All chats stored in PostgreSQL
- **Markdown Rendering** - AI responses with full markdown support
- **Response Regeneration** - Regenerate responses with automatic cleanup
- **Secure Authentication** - NextAuth.js with credentials provider

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Database**: Prisma ORM + PostgreSQL
- **Auth**: NextAuth.js v5
- **AI**: Vercel AI SDK + OpenAI GPT-4

## 🚀 Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup** - Create `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/db"
   AUTH_SECRET="your-secret-key"
   OPENAI_API_KEY="sk-..."
   ```

3. **Database Setup**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

4. **Run**:
   ```bash
   npm run dev
   ```

## 🔑 Demo Credentials

- **Email**: `demo@example.com`
- **Password**: `password123`

## 💡 How It Works

### Personality Profiles
After chatting, ask any of these:
- "Who am I?"
- "Tell me about myself"
- "Analyze me"
- "Describe me"
- "What have you learned about me?"

The AI analyzes your communication style, interests, and traits to generate a structured profile.

### Feedback System
1. Chat with the AI
2. Use 👍 for helpful responses, 👎 for unhelpful ones
3. The AI incorporates feedback into future responses
4. Regenerating clears feedback for that message

## 🧪 Testing

```bash
npm test
# or
npx vitest run
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── chat/route.ts      # Chat streaming endpoint
│   │   └── feedback/route.ts  # Feedback CRUD
│   ├── chat/page.tsx          # Chat page
│   └── login/page.tsx         # Login page
├── components/
│   └── chat-interface.tsx     # Main chat component
└── lib/
    ├── personality.ts         # Profile trigger & prompts
    └── prisma.ts              # Database client
```
