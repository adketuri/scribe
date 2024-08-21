import { NextRequest } from 'next/server';
import { assertAdmin, assertAuthenticated } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export async function GET() {
  await assertAuthenticated();
  const sequences = await prisma.sequence.findMany({ orderBy: { name: 'asc' } });
  return Response.json({ sequences });
}

export async function POST(request: NextRequest) {
  await assertAdmin();
  try {
    const body = await request.json();
    const message = await prisma.sequence.create({
      data: {
        name: body.name,
        context: body.context,
        editable: true,
      },
    });
    return Response.json({ message });
  } catch (e) {
    console.log(e);
    return Response.error();
  }
}
