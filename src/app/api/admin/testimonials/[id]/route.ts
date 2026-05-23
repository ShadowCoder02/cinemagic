import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

const schema = z.object({
  clientName: z.string().min(1).optional(),
  eventType: z.string().optional(),
  quote: z.string().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
  avatarUrl: z.string().optional(),
  location: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const t = await prisma.testimonial.update({ where: { id }, data: parsed.data });
  return NextResponse.json(t);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
