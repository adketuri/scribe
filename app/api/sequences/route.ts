import { NextRequest } from 'next/server';
import { assertAdmin, assertAuthenticated } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export async function GET() {
  await assertAuthenticated();
  const sequences = await prisma.sequence.findMany({ orderBy: { name: 'asc' } });

  return Response.json({
    sequences: sequences.sort((a, b) => {
      const aParts = a.name.split('.').map(Number);
      const bParts = b.name.split('.').map(Number);
      for (let j = 0; j < 3; j += 1) {
        if (aParts[j] !== bParts[j]) {
          return aParts[j] - bParts[j];
        }
      }
      return 0;
    }),
  });
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
