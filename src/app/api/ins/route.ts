import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const insEntries = await prisma.insEntry.findMany();
    return NextResponse.json(insEntries);
  } catch (err: any) {
    console.error("CRITICAL DATABASE ERROR [/api/ins]:", {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    return NextResponse.json({ error: "Failed to fetch INS dictionary", details: err.message }, { status: 500 });
  }
}
