import { assertAuthenticated } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export async function GET() {
  await assertAuthenticated();
  const languages = await prisma.lang.findMany({ orderBy: { id: 'asc' } });
  return Response.json({ languages });
}
