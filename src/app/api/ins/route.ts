import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const insEntries = await prisma.insEntry.findMany();
    return NextResponse.json(insEntries);
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    const prismaError = err as Record<string, unknown>;
    console.error("CRITICAL DATABASE ERROR [/api/ins]:", {
      message: error.message,
      stack: error.stack,
      code: prismaError.code
    });
    return NextResponse.json({ error: "Failed to fetch INS dictionary", details: error.message }, { status: 500 });
  }
}
