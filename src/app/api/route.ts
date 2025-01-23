import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'API is running' });
}

export const dynamic = 'force-dynamic';
export const revalidate = 0; 