import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Here you can add custom logic to check if user should be allowed to sign in
      // For now, we'll allow all Google users
      return true
    },
    async jwt({ token, user, account }) {
      // Store additional user info in the token
      if (account && user) {
        token.accessToken = account.access_token
        token.provider = account.provider
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.accessToken = token.accessToken as string
        session.provider = token.provider as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after successful Google auth
      if (url.startsWith('/')) return `${baseUrl}/dashboard`
      // If it's a callback from Google, redirect to dashboard
      if (url.includes('callbackUrl')) return `${baseUrl}/dashboard`
      return `${baseUrl}/dashboard`
    }
  },
  pages: {
    signIn: '/onboarding', // Redirect to our custom onboarding page
    error: '/onboarding', // Error code passed in query string as ?error=
  },
  session: {
    strategy: 'jwt',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
