import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

const schema = z.object({
  clientName: z.string().min(1),
  eventType: z.string().optional(),
  quote: z.string().min(1),
  rating: z.number().min(1).max(5).default(5),
  avatarUrl: z.string().optional(),
  location: z.string().optional(),
  isFeatured: z.boolean().default(true),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const t = await prisma.testimonial.create({ data: parsed.data });
  return NextResponse.json(t, { status: 201 });
}
