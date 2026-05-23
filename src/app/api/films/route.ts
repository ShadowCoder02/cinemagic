import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const films = await prisma.film.findMany({
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json(films);
}
