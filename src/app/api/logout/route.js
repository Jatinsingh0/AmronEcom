import { NextResponse } from 'next/server'

export async function POST() {
  // Invalidate token on client by removing it; nothing to do server-side for stateless JWT
  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
} 