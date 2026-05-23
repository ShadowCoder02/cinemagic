import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

const schema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isPublic: z.boolean().optional(),
});

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const album = await prisma.album.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: 'asc' } } },
  });
  if (!album) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(album);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const album = await prisma.album.update({
    where: { id },
    data: parsed.data,
    include: { _count: { select: { photos: true } } },
  });
  return NextResponse.json(album);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await prisma.album.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
