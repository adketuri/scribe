import { NextRequest } from 'next/server';
import { z } from 'zod';
import { assertEditor } from '@/app/actions/auth';
import prisma from '@/app/lib/database';

export const CreateMessageSchema = z.object({
  sequenceId: z.string(),
});

export async function POST(request: NextRequest) {
  await assertEditor();

  const validated = CreateMessageSchema.parse(await request.json());

  const message = await prisma.message.create({
    data: {
      sequenceId: validated.sequenceId,
      order: 0,
      speaker: '',
      texts: { create: { languageId: 'en', text: 'New Message', checked: false } },
    },
  });
  return Response.json({ message });
}
