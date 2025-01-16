import prisma from '@/libs/prismaDB';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
  interface User {
    roles: string[];
  }

  interface Session {
    user: {
      id?: string | null | undefined;
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
      roles: string[];
    };
  }
}

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },

  secret: process.env.NEXTAUTH_SECRET!,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          roles: user.roles,
        };
      }
      return token;
    },

    session: async ({ session, token }: { session: Session; token: JWT }) => {
      if (token) {
        session.user = token.user as typeof session.user;
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);
