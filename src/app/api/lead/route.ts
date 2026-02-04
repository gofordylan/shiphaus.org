import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, city, twitter, linkedin, whatYouBuild, why, whoYouInvite } = body;

    // Validate required fields
    if (!name || !email || !city || !whatYouBuild || !why) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store application data
    const applicationData = {
      id,
      name,
      email,
      city,
      twitter: twitter || '',
      linkedin: linkedin || '',
      whatYouBuild,
      why,
      whoYouInvite: whoYouInvite || '',
      timestamp: new Date().toISOString(),
    };

    await kv.hset(id, applicationData);
    await kv.rpush('lead_applications', id);

    console.log('New lead application:', id);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Lead application error:', error);
    return NextResponse.json(
      { error: "Didn't work. Try again?" },
      { status: 500 }
    );
  }
}
