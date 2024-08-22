import { NextRequest } from 'next/server';
import { assertAdmin } from '@/app/actions/auth';
import prisma from '@/app/lib/database';
import { translate } from '@/app/lib/translate';

export async function POST(request: NextRequest, { params }: { params: { name: string } }) {
  await assertAdmin();

  const { name } = params;
  if (!name) throw new Error();

  const sequence = await prisma.sequence.findFirstOrThrow({
    where: {
      name,
    },
    include: {
      messages: {
        include: {
          texts: true,
        },
      },
    },
  });

  const languages = await prisma.lang.findMany();

  const body = await request.json();
  const { override } = body;

  for (const message of sequence.messages) {
    const en = message.texts.find((t) => t.languageId === 'en');
    if (!en) throw new Error(`Missing English for message: ${message.id}`);

    for (const language of languages.filter((l) => l.id !== 'en')) {
      const textRecord = message.texts.find((t) => t.languageId === language.id);
      if (textRecord) {
        if (override || textRecord.text.trim().length <= 0) {
          const translatedText = await translate(en.text, language.id);
          await prisma.text.update({
            where: { id: textRecord.id },
            data: { text: translatedText, checked: false },
          });
        }
      } else {
        const translatedText = await translate(en.text, language.id);
        await prisma.text.create({
          data: {
            text: translatedText,
            checked: false,
            languageId: language.id,
            messageId: message.id,
          },
        });
      }
    }
  }

  return Response.json({ sequence });
}
