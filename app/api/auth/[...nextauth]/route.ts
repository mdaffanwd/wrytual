import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { User } from '@/models/User'
import type { NextAuthOptions } from 'next-auth'
import connectToDatabase from '@/lib/db'

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            await connectToDatabase()

            const existingUser = await User.findOne({ email: user.email })

            if (!existingUser) {
                await User.create({
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    provider: account?.provider,
                })
            }

            return true
        },
        async session({ session }) {
            await connectToDatabase()
            const dbUser = await User.findOne({ email: session.user?.email })

            if (dbUser) {
                session.user.id = dbUser._id.toString()
            }

            return session
        },
        redirect({ url, baseUrl }) {
            // always redirect to dashboard after login
            return '/dashboard'
        }
    },
    session: {
        strategy: 'jwt', // Default, still mention it explicitly
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        updateAge: 24 * 60 * 60,
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
