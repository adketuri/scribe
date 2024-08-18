import { NextRequest } from 'next/server';
import { assertEditor } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await assertEditor();

  const res = await request.json();
  await prisma.text.update({ where: { id: params.id }, data: { text: res.text } });
  return Response.json(null, { status: 200 });
}
