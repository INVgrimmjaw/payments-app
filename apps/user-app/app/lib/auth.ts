import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@repo/db/client"
import bcrypt from "bcrypt"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) return null

        const valid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!valid) return null

        return {
          id: user.id.toString(),
          name: user.name ?? "",
          email: user.email ?? "",
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.sub = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
})