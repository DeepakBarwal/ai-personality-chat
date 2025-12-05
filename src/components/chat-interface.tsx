'use client'

import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, User, Bot } from 'lucide-react'

export default function ChatInterface({ initialMessages }: { initialMessages: any[] }) {
    const { messages, isLoading, append } = useChat({
        initialMessages,
        api: '/api/chat',
    })

    const [input, setInput] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return
        const userMessage = input
        setInput('')
        await append({ role: 'user', content: userMessage })
    }

    const hasMessages = messages.length > 0

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
            {/* Chat Area */}
            <ScrollArea className="flex-1">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {!hasMessages && (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/25">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h2 className="text-2xl font-semibold text-white mb-2">
                                Welcome to AI Personality Chat
                            </h2>
                            <p className="text-slate-400 max-w-md mb-8">
                                Start a conversation and I'll learn about you. Ask "Who am I?" anytime to get a personality profile based on our chat.
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {["Tell me about yourself", "What are your hobbies?", "Who am I?"].map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        onClick={() => {
                                            setInput(suggestion)
                                            inputRef.current?.focus()
                                        }}
                                        className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-slate-300 text-sm hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-200"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {hasMessages && (
                        <div className="space-y-6">
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex gap-4 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <Avatar className={`w-10 h-10 ${m.role === 'user'
                                                ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                                : 'bg-gradient-to-br from-violet-500 to-fuchsia-500'
                                            }`}>
                                            <AvatarFallback className="bg-transparent text-white">
                                                {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>

                                    {/* Message Bubble */}
                                    <div
                                        className={`flex-1 max-w-[80%] ${m.role === 'user' ? 'text-right' : 'text-left'}`}
                                    >
                                        <div
                                            className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-sm'
                                                    : 'bg-slate-800/80 text-slate-100 rounded-tl-sm border border-slate-700/50'
                                                }`}
                                        >
                                            <div className="whitespace-pre-wrap">{m.content}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Loading indicator - only show when loading and last message isn't from assistant */}
                            {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0">
                                        <Avatar className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500">
                                            <AvatarFallback className="bg-transparent text-white">
                                                <Bot className="w-5 h-5" />
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1">
                                        <div className="inline-block px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-800/80 border border-slate-700/50">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.3s]"></div>
                                                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.15s]"></div>
                                                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={scrollRef} />
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-slate-800 bg-slate-900/80 backdrop-blur-xl">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <form onSubmit={onSubmit} className="relative">
                        <Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            disabled={isLoading}
                            className="w-full pr-14 py-6 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all duration-200"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <Send className="w-4 h-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                    <p className="text-center text-xs text-slate-500 mt-3">
                        AI can make mistakes. Consider checking important information.
                    </p>
                </div>
            </div>
        </div>
    )
}
