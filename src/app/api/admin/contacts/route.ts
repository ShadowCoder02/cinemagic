import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin-auth';

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') as 'NEW' | 'IN_PROGRESS' | 'ARCHIVED' | null;
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(50, Number(searchParams.get('limit') ?? 20));

  const where = status ? { status } : undefined;
  const [contacts, total] = await Promise.all([
    prisma.contactRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contactRequest.count({ where }),
  ]);

  return NextResponse.json({ contacts, total, page, limit });
}

export async function PATCH(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const schema = z.object({
    id: z.string(),
    status: z.enum(['NEW', 'IN_PROGRESS', 'ARCHIVED']).optional(),
    notes: z.string().optional(),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  const { id, ...data } = parsed.data;
  const contact = await prisma.contactRequest.update({ where: { id }, data });
  return NextResponse.json(contact);
}
