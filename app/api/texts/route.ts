import { NextRequest } from 'next/server';
import { assertAuthenticated } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export async function POST(request: NextRequest) {
  await assertAuthenticated();

  const res = await request.json();
  const { languageId, messageId, text } = res;
  const textRecord = await prisma.text.create({
    data: {
      languageId,
      messageId,
      text,
    },
  });
  return Response.json({ text: textRecord });
}
