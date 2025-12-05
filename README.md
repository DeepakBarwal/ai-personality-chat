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
- **Interactive API Docs** - Scalar-powered OpenAPI documentation

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Shadcn UI |
| Database | Prisma ORM + PostgreSQL |
| Auth | NextAuth.js v5 |
| AI | Vercel AI SDK + OpenAI GPT-4 |
| Testing | Vitest |
| API Docs | Scalar (OpenAPI 3.1) |

## DB Diagram

![Database Diagram](./db.png)

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
   
   # Demo user credentials (for seeding)
   DEMO_USER_EMAIL="your-demo@email.com"
   DEMO_USER_PASSWORD="your-secure-password"
   DEMO_USER_NAME="Demo User"
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

## 🔑 Authentication

Demo credentials are configured via environment variables and provided separately for security.
See the submission notes for login details.

## 📚 API Documentation

Interactive API documentation is available at:

```
http://localhost:3000/docs
```

Features:
- Modern Scalar UI with dark mode
- Interactive API explorer
- Request/response examples
- Search with Cmd/Ctrl+K

See [API_DOCS.md](./API_DOCS.md) for detailed endpoint documentation.

## 💡 How It Works

### Personality Profiles
After chatting, ask any of these:
- "Who am I?"
- "Tell me about myself"
- "Analyze me"
- "Describe me"
- "What have you learned about me?"
- "Profile me"

The AI analyzes your communication style, interests, and traits to generate a structured profile with emoji headers.

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
ai-personality-chat/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Demo user seeding (gitignored)
├── public/
│   └── openapi.json           # OpenAPI 3.1 specification
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # Auth endpoints
│   │   │   ├── chat/route.ts                # Chat streaming
│   │   │   └── feedback/route.ts            # Feedback CRUD
│   │   ├── chat/page.tsx      # Chat page
│   │   ├── docs/route.ts      # API documentation (Scalar)
│   │   ├── login/page.tsx     # Login page
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── chat-interface.tsx # Main chat component
│   │   └── ui/                # Shadcn UI components
│   ├── lib/
│   │   ├── personality.ts     # Profile triggers & prompts
│   │   ├── personality.test.ts # Unit tests
│   │   ├── prisma.ts          # Prisma client
│   │   └── utils.ts           # Utility functions
│   ├── auth.ts                # NextAuth config
│   ├── auth.config.ts         # Auth edge config
│   └── middleware.ts          # Route protection
├── API_DOCS.md                # API documentation (markdown)
├── README.md                  # This file
└── package.json
```

## 📊 Database Schema

```
User ──< Conversation ──< Message ──○ Feedback
```

- **User**: id, name, email, password
- **Conversation**: id, userId
- **Message**: id, conversationId, role, content
- **Feedback**: id, messageId, rating (up/down)

## 🌐 Deployment

This app is Vercel-ready. Set environment variables in Vercel dashboard and deploy.

```bash
vercel
```
