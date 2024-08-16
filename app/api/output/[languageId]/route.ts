import { NextRequest } from 'next/server';
import { assertAuthenticated } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export async function GET(request: NextRequest, { params }: { params: { languageId: string } }) {
  await assertAuthenticated();
  const sequences = await prisma.sequence.findMany({
    orderBy: { name: 'asc' },
    include: { messages: { include: { texts: { where: { languageId: params.languageId } } } } },
  });
  return Response.json({ sequences });
}
