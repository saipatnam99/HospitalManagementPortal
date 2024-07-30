import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface Credentials {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) return null;

        const { email, password } = credentials;

        try {
          // Fetch user from Prisma
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) return null;

          // Verify password
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (!passwordsMatch) return null;

          return { id: user.id, email: user.email, username: user.username };
        } catch (error) {
          console.error('Authorization Error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      if (user) {
        session.user = {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
