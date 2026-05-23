import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const albums = await prisma.album.findMany({
    where: { isPublic: true },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    include: { photos: { orderBy: { order: 'asc' } } },
  });
  return NextResponse.json(albums);
}
