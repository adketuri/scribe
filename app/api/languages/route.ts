import { NextRequest } from 'next/server';
import { assertAdmin, assertAuthenticated } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export async function GET() {
  await assertAuthenticated();
  const languages = await prisma.lang.findMany({ orderBy: { id: 'asc' } });
  return Response.json({ languages });
}

export async function POST(request: NextRequest) {
  await assertAdmin();
  try {
    const body = await request.json();
    const message = await prisma.lang.create({
      data: {
        id: body.languageId,
      },
    });
    return Response.json({ message });
  } catch (e) {
    console.log(e);
    return Response.error();
  }
}
