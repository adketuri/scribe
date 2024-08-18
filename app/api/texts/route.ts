import { NextRequest } from 'next/server';
import { assertEditor } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export async function POST(request: NextRequest) {
  await assertEditor();

  const { languageId, messageId, text } = await request.json();
  const textRecord = await prisma.text.create({
    data: {
      languageId,
      messageId,
      text,
    },
  });
  return Response.json({ text: textRecord });
}
