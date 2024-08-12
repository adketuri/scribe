import { assertAuthenticated } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export async function GET() {
  await assertAuthenticated();
  const sequences = await prisma.sequence.findMany({ orderBy: { name: 'asc' } });
  return Response.json({ sequences });
}
