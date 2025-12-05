import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import ChatInterface from '@/components/chat-interface'
import { redirect } from 'next/navigation'
import { signOut } from '@/auth'
import { LogOut, Sparkles } from 'lucide-react'

export default async function ChatPage() {
    const session = await auth()
    if (!session?.user?.email) redirect('/login')

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { conversations: { orderBy: { updatedAt: 'desc' }, take: 1 } }
    })

    let initialMessages: any[] = []
    let initialFeedback: Record<string, 'up' | 'down' | null> = {}

    if (user?.conversations[0]) {
        const messages = await prisma.message.findMany({
            where: { conversationId: user.conversations[0].id },
            orderBy: { createdAt: 'asc' },
            take: 50,
            include: { feedback: true }
        })
        initialMessages = messages.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content
        }))
        // Build initial feedback state
        messages.forEach(m => {
            if (m.feedback) {
                initialFeedback[m.id] = m.feedback.rating as 'up' | 'down'
            }
        })
    }

    return (
        <div className="flex flex-col h-screen bg-slate-950">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-white">AI Personality Chat</h1>
                        <p className="text-xs text-slate-400">Learns from your feedback</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-white">
                            {session.user.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-400">{session.user.email}</p>
                    </div>
                    <form action={async () => {
                        'use server'
                        await signOut()
                    }}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition-all duration-200"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </form>
                </div>
            </header>

            {/* Main Chat Area */}
            <main className="flex-1 overflow-hidden">
                <ChatInterface initialMessages={initialMessages} initialFeedback={initialFeedback} />
            </main>
        </div>
    )
}
