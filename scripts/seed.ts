/* eslint-disable no-console */
import translate from 'google-translate-api-browser';
import { PrismaClient } from '@prisma/client';
import { Dialogue } from '@/types/dialogue';
import rawDialogue from '../../su-output.json';

const prisma = new PrismaClient();

async function main() {
  const lang = await prisma.lang.createManyAndReturn({
    data: [{ id: 'en' }, { id: 'ja' }],
  });
  console.log('Created languages: ', lang);

//   const allDialogue: Dialogue[] = rawDialogue;

//   // TODO: Find unique violations here if we care to
//   //console.log(allDialogue.map((d) => d.sequence));

//   // TODO: actually just delete these and run thru the upload flow instead
//   const sequences = await prisma.sequence.createMany({
//     data: allDialogue.map((dialog) => ({ context: dialog.context, name: dialog.sequence })),
//   });
//   console.log('Created sequences: ', sequences);

//   for (const dialogue of allDialogue) {
//     for (let i = 0; i < dialogue.messages.length; i += 1) {
//       const { speaker, text } = dialogue.messages[i];
//       const sequence = await prisma.sequence.findFirstOrThrow({
//         where: { name: dialogue.sequence },
//       });
//       const messageRecord = await prisma.message.create({
//         data: {
//           order: i,
//           speaker,
//           sequenceId: sequence.id,
//         },
//       });
//       // const ja = await translate(text.en, { to: 'ja' });
//       const ja = { text: '乇乂ㄒ尺卂　ㄒ卄丨匚匚' };
//       const textRecord = await prisma.text.createMany({
//         data: [
//           { languageId: 'en', text: text.en, messageId: messageRecord.id },
//           { languageId: 'ja', text: ja.text, messageId: messageRecord.id },
//         ],
//       });
//       console.log(`  Created text ${i + 1}: `, textRecord);
//     }
//   }
//   console.log('Created messages');
// }

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
