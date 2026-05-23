import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const album = await prisma.album.update({
      where: { id, isPublic: true },
      data: { likes: { increment: 1 } },
      select: { likes: true },
    });
    return NextResponse.json({ likes: album.likes });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const album = await prisma.album.update({
      where: { id, isPublic: true },
      data: { likes: { decrement: 1 } },
      select: { likes: true },
    });
    return NextResponse.json({ likes: album.likes });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
