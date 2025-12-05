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

    // Check if this is a regenerate request by checking if last message already exists in DB
    const existingMessages = await prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'desc' },
        take: 2
    })

    const isRegenerate = existingMessages.length >= 2 &&
        existingMessages[1]?.content === lastMessage.content &&
        existingMessages[1]?.role === 'user'

    if (isRegenerate) {
        // Delete the last assistant message (we're regenerating it)
        const lastAssistantMsg = existingMessages[0]
        if (lastAssistantMsg?.role === 'assistant') {
            // Also delete any feedback for this message
            await prisma.feedback.deleteMany({
                where: { messageId: lastAssistantMsg.id }
            })
            await prisma.message.delete({
                where: { id: lastAssistantMsg.id }
            })
        }
    } else {
        // Save new user message only if not regenerating
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                role: 'user',
                content: lastMessage.content
            }
        })
    }

    // Check for personality trigger
    const isProfileRequest = shouldTriggerProfile(lastMessage.content)

    // Fetch history with feedback for context (last 50 messages)
    const history = await prisma.message.findMany({
        where: { conversationId: conversation.id },
        orderBy: { createdAt: 'asc' },
        take: 50,
        include: { feedback: true }
    })

    // Analyze feedback patterns
    const feedbackStats = history.reduce((acc, m) => {
        if (m.feedback) {
            if (m.feedback.rating === 'up') acc.liked++
            else acc.disliked++
        }
        return acc
    }, { liked: 0, disliked: 0 })

    // Get recently disliked messages to understand what to avoid
    const dislikedMessages = history
        .filter(m => m.feedback?.rating === 'down')
        .slice(-3)
        .map(m => m.content.slice(0, 100))

    // Get recently liked messages to understand what works
    const likedMessages = history
        .filter(m => m.feedback?.rating === 'up')
        .slice(-3)
        .map(m => m.content.slice(0, 100))

    // Build enhanced system prompt with feedback context
    let systemPrompt = getSystemPrompt(isProfileRequest)

    if (feedbackStats.liked > 0 || feedbackStats.disliked > 0) {
        systemPrompt += `\n\n--- FEEDBACK CONTEXT ---
The user has provided feedback on ${feedbackStats.liked + feedbackStats.disliked} responses:
- ${feedbackStats.liked} responses were marked as helpful
- ${feedbackStats.disliked} responses were marked as unhelpful`

        if (likedMessages.length > 0) {
            systemPrompt += `\n\nExamples of responses the user found helpful (try to match this style):
${likedMessages.map((m, i) => `${i + 1}. "${m}..."`).join('\n')}`
        }

        if (dislikedMessages.length > 0) {
            systemPrompt += `\n\nExamples of responses the user didn't like (avoid this style):
${dislikedMessages.map((m, i) => `${i + 1}. "${m}..."`).join('\n')}`
        }

        systemPrompt += '\n\nUse this feedback to improve your responses. Be more like the helpful examples and avoid patterns from unhelpful ones.'
    }

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
