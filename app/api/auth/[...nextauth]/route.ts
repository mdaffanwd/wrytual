import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { User } from '@/models/User'
import type { NextAuthOptions } from 'next-auth'
import connectToDatabase from '@/lib/db'
import bcrypt from 'bcryptjs'

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
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required')
                }

                await connectToDatabase()
                
                const user = await User.findOne({ email: credentials.email })
                
                if (!user || !user.password) {
                    throw new Error('Invalid email or password')
                }

                // Check if email is verified for credentials provider
                if (user.provider === 'credentials' && !user.emailVerified) {
                    throw new Error('Please verify your email address before logging in')
                }

                const passwordMatch = await bcrypt.compare(credentials.password, user.password)
                
                if (!passwordMatch) {
                    throw new Error('Invalid email or password')
                }

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    emailVerified: user.emailVerified,
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }) {
            await connectToDatabase()

            const existingUser = await User.findOne({ email: user.email })

            if (!existingUser && account?.provider === 'google') {
                await User.create({
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    provider: account?.provider,
                    emailVerified: true, // Google accounts are pre-verified
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
        async redirect({ url, baseUrl }) {
            // always redirect to dashboard after login
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return `${baseUrl}/dashboard`
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
