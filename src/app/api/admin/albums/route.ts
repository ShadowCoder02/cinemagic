import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';
import { slugify } from '@/lib/slugify';

const schema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  location: z.string().optional(),
  category: z.string().default('wedding'),
  isFeatured: z.boolean().default(false),
  isPublic: z.boolean().default(true),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const albums = await prisma.album.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { photos: true } } },
  });
  return NextResponse.json(albums);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const slug = data.slug || slugify(data.title);

  const album = await prisma.album.create({
    data: { ...data, slug },
    include: { _count: { select: { photos: true } } },
  });
  return NextResponse.json(album, { status: 201 });
}
