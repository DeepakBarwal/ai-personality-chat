import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messageId, content, rating } = await req.json()

    if (!rating || !['up', 'down'].includes(rating)) {
        return NextResponse.json({ error: 'Invalid rating' }, { status: 400 })
    }

    try {
        // First try to find the message by ID
        let message = await prisma.message.findUnique({ where: { id: messageId } })

        // If not found by ID, find by content (for new messages)
        if (!message && content) {
            message = await prisma.message.findFirst({
                where: { content, role: 'assistant' },
                orderBy: { createdAt: 'desc' }
            })
        }

        if (!message) {
            return NextResponse.json({ error: 'Message not found' }, { status: 404 })
        }

        // Upsert feedback
        const feedback = await prisma.feedback.upsert({
            where: { messageId: message.id },
            create: {
                messageId: message.id,
                rating,
            },
            update: {
                rating,
            },
        })

        return NextResponse.json({ success: true, feedback })
    } catch (error) {
        console.error('Feedback error:', error)
        return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    const session = await auth()
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { messageId, content } = await req.json()

    try {
        // First try to find the message by ID
        let message = await prisma.message.findUnique({ where: { id: messageId } })

        // If not found by ID, find by content
        if (!message && content) {
            message = await prisma.message.findFirst({
                where: { content, role: 'assistant' },
                orderBy: { createdAt: 'desc' }
            })
        }

        if (message) {
            await prisma.feedback.delete({
                where: { messageId: message.id },
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        // Ignore if not found
        return NextResponse.json({ success: true })
    }
}
