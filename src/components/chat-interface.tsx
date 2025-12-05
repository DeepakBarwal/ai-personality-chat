'use client'

import { useChat } from 'ai/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, User, Bot, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Feedback = 'up' | 'down' | null

interface ChatInterfaceProps {
    initialMessages: { id: string; role: 'user' | 'assistant'; content: string }[]
    initialFeedback?: Record<string, Feedback>
}

export default function ChatInterface({ initialMessages, initialFeedback = {} }: ChatInterfaceProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { messages, isLoading, append, reload } = useChat({
        initialMessages,
        api: '/api/chat',
    })

    const [input, setInput] = useState('')
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [feedback, setFeedback] = useState<Record<string, Feedback>>(initialFeedback)
    const [toast, setToast] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 2000)
            return () => clearTimeout(timer)
        }
    }, [toast])

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return
        const userMessage = input
        setInput('')
        await append({ role: 'user', content: userMessage })
    }

    const copyToClipboard = async (text: string, id: string) => {
        await navigator.clipboard.writeText(text)
        setCopiedId(id)
        setToast('Copied to clipboard!')
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleFeedback = async (msgId: string, msgContent: string, type: Feedback) => {
        const current = feedback[msgId]

        if (current === type) {
            setFeedback(prev => ({ ...prev, [msgId]: null }))
            setToast('Feedback removed')

            try {
                await fetch('/api/feedback', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messageId: msgId, content: msgContent }),
                })
            } catch (error) {
                console.error('Failed to delete feedback:', error)
            }
        } else {
            setFeedback(prev => ({ ...prev, [msgId]: type }))
            setToast(type === 'up' ? 'Thanks! AI will learn from this 👍' : 'Noted! AI will adjust its style')

            try {
                await fetch('/api/feedback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messageId: msgId, content: msgContent, rating: type }),
                })
            } catch (error) {
                console.error('Failed to save feedback:', error)
                setFeedback(prev => ({ ...prev, [msgId]: current }))
                setToast('Failed to save feedback')
            }
        }
    }

    const handleRegenerate = () => {
        // Clear feedback state for the last assistant message
        const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant')
        if (lastAssistantMsg) {
            setFeedback(prev => {
                const updated = { ...prev }
                delete updated[lastAssistantMsg.id]
                return updated
            })
        }

        reload()
        setToast('Regenerating response...')
    }

    const hasMessages = messages.length > 0

    return (
        <div className="flex flex-col h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative">
            {/* Toast Notification */}
            {toast && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-sm shadow-lg">
                        {toast}
                    </div>
                </div>
            )}

            {/* Chat Area - using native scroll */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
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
                                Start a conversation and I'll learn about you. Use 👍/👎 to help me understand your preferences. Ask "Who am I?" for a personality profile.
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
                            {messages.map((m, index) => {
                                const isLastAssistant = m.role === 'assistant' && index === messages.length - 1
                                const isStreaming = isLoading && isLastAssistant

                                return (
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

                                        {/* Message Content */}
                                        <div className={`flex-1 max-w-[80%] ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            <div
                                                className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user'
                                                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-tr-sm'
                                                        : 'bg-slate-800/80 text-slate-100 rounded-tl-sm border border-slate-700/50'
                                                    }`}
                                            >
                                                {m.role === 'assistant' ? (
                                                    <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-code:text-violet-300 prose-code:bg-slate-900 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                            {m.content}
                                                        </ReactMarkdown>
                                                    </div>
                                                ) : (
                                                    <div className="whitespace-pre-wrap">{m.content}</div>
                                                )}
                                            </div>

                                            {/* Action buttons for AI messages - show after streaming ends */}
                                            {m.role === 'assistant' && !isStreaming && (
                                                <div className="flex items-center gap-1 mt-2">
                                                    <button
                                                        onClick={() => copyToClipboard(m.content, m.id)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all duration-200"
                                                        title="Copy to clipboard"
                                                    >
                                                        {copiedId === m.id ? (
                                                            <Check className="w-4 h-4 text-green-400" />
                                                        ) : (
                                                            <Copy className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    {index === messages.length - 1 && (
                                                        <button
                                                            onClick={handleRegenerate}
                                                            disabled={isLoading}
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all duration-200 disabled:opacity-50"
                                                            title="Regenerate response"
                                                        >
                                                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                                                        </button>
                                                    )}
                                                    <div className="w-px h-4 bg-slate-700 mx-1" />
                                                    <button
                                                        onClick={() => handleFeedback(m.id, m.content, 'up')}
                                                        className={`p-1.5 rounded-lg transition-all duration-200 ${feedback[m.id] === 'up'
                                                                ? 'text-green-400 bg-green-400/10'
                                                                : 'text-slate-500 hover:text-green-400 hover:bg-slate-800/50'
                                                            }`}
                                                        title="Good response - AI will learn from this"
                                                    >
                                                        <ThumbsUp className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleFeedback(m.id, m.content, 'down')}
                                                        className={`p-1.5 rounded-lg transition-all duration-200 ${feedback[m.id] === 'down'
                                                                ? 'text-red-400 bg-red-400/10'
                                                                : 'text-slate-500 hover:text-red-400 hover:bg-slate-800/50'
                                                            }`}
                                                        title="Bad response - AI will avoid this style"
                                                    >
                                                        <ThumbsDown className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}

                            {/* Loading indicator */}
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

                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>

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
                        Your feedback helps improve AI responses. Use 👍/👎 to train it.
                    </p>
                </div>
            </div>
        </div>
    )
}
