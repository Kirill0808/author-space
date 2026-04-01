import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
      createdAt: any
    } & DefaultSession["user"]
  }
}

import { type DefaultSession } from "next-auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, user }: any) {
      if (session.user && user) {
        session.user.id = user.id
        session.user.role = user.role
        session.user.createdAt = user.createdAt
      }
      return session
    },
  },
  trustHost: true,
})
