import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';

export async function GET() {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);
  if (!session?.username) {
    throw new Error('Unauthorized access');
  }
  return Response.json({ session });
}
