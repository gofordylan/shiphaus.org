import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    signIn({ user }) {
      return !!user.email;
    },
    jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.isAdmin = ADMIN_EMAILS.includes(
          (user.email || '').toLowerCase()
        );
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        (session.user as unknown as Record<string, unknown>).isAdmin =
          token.isAdmin as boolean;
      }
      return session;
    },
  },
});
