import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const insEntries = await prisma.insEntry.findMany();
    return NextResponse.json(insEntries);
  } catch (err) {
    console.error("Failed to fetch INS dictionary from database", err);
    return NextResponse.json({ error: "Failed to fetch INS dictionary" }, { status: 500 });
  }
}
