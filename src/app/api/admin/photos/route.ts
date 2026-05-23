import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

const schema = z.object({
  albumId: z.string().min(1),
  url: z.string().min(1),
  title: z.string().optional(),
  description: z.string().optional(),
  isFeatured: z.boolean().default(false),
  order: z.number().default(0),
});

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const albumId = searchParams.get('albumId');

  const photos = await prisma.photo.findMany({
    where: albumId ? { albumId } : undefined,
    orderBy: [{ albumId: 'asc' }, { order: 'asc' }],
    include: { album: { select: { id: true, title: true } } },
  });
  return NextResponse.json(photos);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const photo = await prisma.photo.create({
    data: parsed.data,
    include: { album: { select: { id: true, title: true } } },
  });
  return NextResponse.json(photo, { status: 201 });
}
