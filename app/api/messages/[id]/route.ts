import { NextRequest } from 'next/server';
import { assertEditor } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await assertEditor();

  await prisma.message.delete({ where: { id: params.id } });
  return Response.json(null, { status: 200 });
}
