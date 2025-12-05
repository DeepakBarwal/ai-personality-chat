'use client'

import { useActionState } from 'react'
import { authenticate } from '@/app/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Mail, Lock, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined,
    )

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur-xl opacity-20"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/25">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-slate-400">
                            Sign in to continue to AI Personality Chat
                        </p>
                    </div>

                    {/* Form */}
                    <form action={dispatch} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-300">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="demo@example.com"
                                    required
                                    defaultValue="demo@example.com"
                                    className="pl-10 py-6 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-slate-300">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    defaultValue="password123"
                                    className="pl-10 py-6 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {errorMessage}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-6 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Signing in...
                                </div>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Demo credentials hint */}
                    <div className="mt-6 pt-6 border-t border-slate-800">
                        <p className="text-xs text-slate-500 text-center">
                            Demo credentials are pre-filled for easy access
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
