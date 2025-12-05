import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnChat = nextUrl.pathname.startsWith('/chat');
            const isOnProfile = nextUrl.pathname.startsWith('/profile');

            if (isOnChat || isOnProfile) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
            }
            return token
        },
    },
    providers: [], // Configured in auth.ts
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;
