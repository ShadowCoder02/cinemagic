import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { slugify } from '@/lib/slugify';

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  videoUrl: z.string().min(1),
  platform: z.enum(['YOUTUBE', 'VIMEO', 'CLOUDINARY']).default('YOUTUBE'),
  posterUrl: z.string().optional(),
  duration: z.string().optional(),
  location: z.string().optional(),
  category: z.string().default('wedding'),
  isFeatured: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const films = await prisma.film.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(films);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const slug = data.slug || slugify(data.title);
  const film = await prisma.film.create({ data: { ...data, slug, tags: data.tags ?? [] } });
  return NextResponse.json(film, { status: 201 });
}
