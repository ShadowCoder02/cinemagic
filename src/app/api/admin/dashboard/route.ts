import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [albums, photos, films, published, drafts, testimonials, contacts, recentContacts] =
    await Promise.all([
      prisma.album.count(),
      prisma.photo.count(),
      prisma.film.count(),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.blogPost.count({ where: { status: 'DRAFT' } }),
      prisma.testimonial.count(),
      prisma.contactRequest.count({ where: { status: 'NEW' } }),
      prisma.contactRequest.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, eventType: true, status: true, createdAt: true, email: true },
      }),
    ]);

  return NextResponse.json({
    albums,
    photos,
    films,
    publishedPosts: published,
    draftPosts: drafts,
    testimonials,
    newContacts: contacts,
    recentContacts,
  });
}
