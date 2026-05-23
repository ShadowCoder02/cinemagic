import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { slugify } from '@/lib/slugify';

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  featuredImage: z.string().optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  readTime: z.number().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const slug = data.slug || slugify(data.title);
  const publishedAt = data.status === 'PUBLISHED' ? new Date() : null;

  const post = await prisma.blogPost.create({
    data: { ...data, slug, tags: data.tags ?? [], publishedAt },
  });
  return NextResponse.json(post, { status: 201 });
}
