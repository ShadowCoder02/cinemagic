import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  eventType: z.string().min(1, 'Event type is required'),
  eventDate: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, eventType, eventDate, message } = parsed.data;

    const contact = await prisma.contactRequest.create({
      data: {
        name,
        email,
        phone: phone || null,
        eventType,
        eventDate: eventDate ? new Date(eventDate) : null,
        message,
        status: 'NEW',
      },
    });

    return NextResponse.json({ success: true, id: contact.id }, { status: 201 });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to save your message. Please try again.' },
      { status: 500 }
    );
  }
}
