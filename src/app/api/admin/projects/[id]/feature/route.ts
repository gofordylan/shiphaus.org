import { NextRequest, NextResponse } from 'next/server';
import { toggleFeatured } from '@/lib/redis-data';

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isFeatured = await toggleFeatured(id);
    return NextResponse.json({ featured: isFeatured });
  } catch (error) {
    console.error('Toggle featured error:', error);
    return NextResponse.json({ error: 'Failed to toggle featured' }, { status: 500 });
  }
}
