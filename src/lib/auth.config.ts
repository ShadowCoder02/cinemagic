import type { NextAuthConfig } from 'next-auth';

// Edge-compatible config used by middleware (no Prisma, no bcryptjs)
export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = (auth?.user as { role?: string } | undefined)?.role === 'ADMIN';
      const isLoginPage = nextUrl.pathname === '/admin/login';

      if (isLoginPage) {
        if (isLoggedIn && isAdmin) {
          return Response.redirect(new URL('/admin', nextUrl));
        }
        return true;
      }

      return isLoggedIn && isAdmin;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? 'ADMIN';
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = (token.role as string) ?? 'ADMIN';
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
