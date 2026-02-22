import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateCliToken } from '@/lib/cli-tokens';

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  const email = session.user.email;
  const builderName = session.user.name || email;

  const { token, expiresAt } = await generateCliToken({
    email,
    name: builderName,
    avatar: session.user.image || `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(builderName)}&backgroundColor=c0aede`,
    image: session.user.image || '',
  });

  return NextResponse.json({ token, expiresAt });
}
