/* eslint-disable no-console */
import translate from 'google-translate-api-browser';
import { PrismaClient } from '@prisma/client';
import { Dialogue } from '@/types/dialogue';
import rawDialogue from '../components/ScribeContent/output.json';

const prisma = new PrismaClient();

async function main() {
  const lang = await prisma.lang.createManyAndReturn({
    data: [{ id: 'en' }, { id: 'ja' }],
  });
  console.log('Created languages: ', lang);

  const allDialogue: Dialogue[] = rawDialogue;
  const sequences = await prisma.sequence.createMany({
    data: allDialogue.map((dialog) => ({ context: dialog.context, name: dialog.sequence })),
  });
  console.log('Created sequences: ', sequences);

  for (const dialogue of allDialogue) {
    for (let i = 0; i < dialogue.messages.length; i += 1) {
      const { speaker, text } = dialogue.messages[i];
      const sequence = await prisma.sequence.findFirstOrThrow({
        where: { name: dialogue.sequence },
      });
      const messageRecord = await prisma.message.create({
        data: {
          order: i,
          speaker,
          sequenceId: sequence.id,
        },
      });
      const ja = await translate(text.en, { to: 'ja' });
      const textRecord = await prisma.text.createMany({
        data: [
          { languageId: 'en', text: text.en, messageId: messageRecord.id },
          { languageId: 'ja', text: ja.text, messageId: messageRecord.id },
        ],
      });
      console.log('  Created text: ', textRecord);
    }
  }
  console.log('Created messages');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
