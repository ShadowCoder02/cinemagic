import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(testimonials);
}
