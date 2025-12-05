import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { shouldTriggerProfile, getSystemPrompt } from '@/lib/personality'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export const maxDuration = 30

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { messages } = await req.json()
    const lastMessage = messages[messages.length - 1]

    // Get user
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { conversations: { orderBy: { updatedAt: 'desc' }, take: 1 } }
    })

    if (!user) return new Response('User not found', { status: 404 })

    // Get or create conversation
    let conversation = user.conversations[0]
    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: { userId: user.id }
        })
    }

    // Save user message
    await prisma.message.create({
        data: {
            conversationId: conversation.id,
            role: 'user',
            content: lastMessage.content
        }
    })

    // Check for personality trigger
    const isProfileRequest = shouldTriggerProfile(lastMessage.content)
    const systemPrompt = getSystemPrompt(isProfileRequest)

    // Fetch history for context (last 50 messages)
    const history = await prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' },
        take: 50
    })

    // Convert to OpenAI messages
    const coreMessages = history.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
    }))

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        stream: true,
        messages: [
            { role: 'system', content: systemPrompt },
            ...coreMessages
        ],
    })

    const stream = OpenAIStream(response, {
        onCompletion: async (completion) => {
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    role: 'assistant',
                    content: completion
                }
            })
        }
    })

    return new StreamingTextResponse(stream)
}
