import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

const schema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  platform: z.enum(['YOUTUBE', 'VIMEO', 'CLOUDINARY']).optional(),
  posterUrl: z.string().optional(),
  duration: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const film = await prisma.film.update({
    where: { id },
    data: { ...parsed.data, tags: parsed.data.tags },
  });
  return NextResponse.json(film);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await prisma.film.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
