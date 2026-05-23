import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

// Edge-compatible middleware using NextAuth v5 auth() pattern
// Reads the authjs.session-token JWT cookie directly (no Prisma/bcrypt in edge)
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Only protect admin UI pages — API routes use requireAdmin() internally
  matcher: ['/admin/:path*'],
};
