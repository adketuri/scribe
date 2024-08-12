import { NextRequest } from 'next/server';
import { assertAuthenticated } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
  await assertAuthenticated();

  const { name } = params;
  if (!name) throw new Error();

  const sequences = await prisma.sequence.findMany({
    where: { name },
    orderBy: { name: 'asc' },
    include: { messages: { include: { texts: true } } },
  });
  return Response.json({ sequences });
}
