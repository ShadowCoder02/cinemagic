import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const post = await prisma.blogPost.findFirst({
    where: { slug, status: 'PUBLISHED' },
  });

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Increment views asynchronously — don't block response
  prisma.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  return NextResponse.json({ ...post, views: post.views + 1 });
}
