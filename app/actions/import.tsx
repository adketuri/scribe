/* eslint-disable no-continue */

'use server';

import { redirect } from 'next/navigation';
import prisma from '../lib/database';
import { DialogueFile, LocalizedItem, TextRecord } from '@/types/dialogue';

export async function importDialogue(state: any, formData: FormData) {
  const inputFile = formData.get('dialogue') as File;
  const parsedFile: DialogueFile = JSON.parse(await inputFile.text());

  const {
    dialogues: input,
    items,
    skills,
    augments,
    maps,
    passives,
    monsters,
    statuses,
  } = parsedFile;

  await importSpecial('items', items);
  await importSpecial('skills', skills);
  await importSpecial('augments', augments);
  await importSpecial('maps', maps);
  await importSpecial('passives', passives);
  await importSpecial('monsters', monsters);
  await importSpecial('statuses', statuses);

  // DO DIALOGUES
  const sequenceRecords = await prisma.sequence.findMany({
    include: { messages: { include: { texts: true } } },
  });
  console.log('All sequence counts in DB: ', sequenceRecords.length);

  const existingSequenceRecords = sequenceRecords.filter(
    (s) => !!input.some((d) => d.sequence === s.name)
  );
  console.log('Existing record count: ', existingSequenceRecords.length);

  const removedSequences = sequenceRecords
    .filter((s) => !input.some((d) => d.sequence === s.name))
    .filter((s) => s.name.includes('.'))
    .map((s) => s.name);
  console.log('To remove record count: ', removedSequences.length);

  // Remove any sequences we're not referencing anymore
  if (removedSequences.length) {
    await prisma.sequence.deleteMany({
      where: { name: { in: removedSequences } },
    });
    console.log('  Deleted records');
  }

  // Insert any new sequences
  const newInputs = input.filter((d) => !sequenceRecords.some((s) => s.name === d.sequence));
  console.log('New sequence count: ', newInputs.length);

  if (newInputs.length > 0) {
    newInputs.forEach((newInput) => {
      if (
        newInputs.reduce(
          (count, innerInput) => (newInput.sequence === innerInput.sequence ? count + 1 : count),
          0
        ) > 1
      ) {
        throw new Error(`Duplicate sequence: ${newInput.sequence}`);
      }
    });
    const sequences = await prisma.sequence.createMany({
      data: newInputs.map((dialog) => ({ context: dialog.context, name: dialog.sequence })),
    });
    console.log('  Created sequences: ', sequences);

    for (const dialogue of newInputs) {
      for (let i = 0; i < dialogue.messages.length; i += 1) {
        const { speaker, text } = dialogue.messages[i];
        const sequence = await prisma.sequence.findFirstOrThrow({
          where: { name: dialogue.sequence },
        });
        await createMessageAndTextForSequence(i, speaker, sequence, text);
      }
    }
    console.log('  Created messages');
  }

  // Check for modifications to existing
  console.log('Modifying existing');
  for (const sequence of existingSequenceRecords) {
    console.log(' Checking ', sequence.name);
    const updatedDialogue = input.find((d) => d.sequence === sequence.name);
    if (!updatedDialogue) throw new Error('Existing dialogue cannot be found again?');

    // check if we need to actually modify this message
    let same = true;
    if (updatedDialogue.messages.length !== sequence.messages.length) {
      same = false;
    } else {
      for (let i = 0; i < updatedDialogue.messages.length; i += 1) {
        const updatedText = updatedDialogue.messages[i].text.en;
        const existingText = sequence.messages[i].texts.find((t) => t.languageId === 'en')?.text;
        if (existingText !== updatedText) {
          same = false;
          break;
        }
      }
    }
    if (same) {
      console.log('  Message contents are identical, skipping');
      continue; // We'll skip this sequence if all messages are identical in english
    }

    // delete all existing
    const deleteResult = await prisma.message.deleteMany({ where: { sequenceId: sequence.id } });
    console.log('  Deleted existing messages', deleteResult);

    // insert the new ones
    for (let i = 0; i < updatedDialogue.messages.length; i += 1) {
      const updatedMessage = updatedDialogue.messages[i];
      const { speaker, text } = updatedMessage;
      const existingText = sequence.messages.find(
        (m) => m.texts.find((t) => t.languageId === 'en')?.text === text.en
      );
      if (existingText) {
        const existingJa = existingText.texts.find((t) => t.languageId === 'ja');
        if (existingJa) {
          text.ja = existingJa.text;
        }
      }
      await createMessageAndTextForSequence(i, speaker, sequence, text);
    }
  }

  // DO ITEMS
  return redirect('/admin?reset=1');
}
async function createMessageAndTextForSequence(
  i: number,
  speaker: string,
  sequence: { id: string; name: string; context: string },
  text: TextRecord
) {
  const messageRecord = await prisma.message.create({
    data: {
      order: i,
      speaker,
      sequenceId: sequence.id,
    },
  });
  // insert from script
  // const ja = await translate(text.en, { to: 'ja' });
  const ja = { text: '乇乂ㄒ尺卂　ㄒ卄丨匚匚' };
  const textRecord = await prisma.text.createMany({
    data: [
      { languageId: 'en', text: text.en!, messageId: messageRecord.id, checked: true },
      { languageId: 'ja', text: ja.text, messageId: messageRecord.id, checked: false },
    ],
  });

  console.log(`    Created text ${i + 1}: `, textRecord);
}

async function importSpecial(name: string, items: LocalizedItem[]) {
  let sequence = await prisma.sequence.findFirst({ where: { name } });
  if (!sequence) {
    sequence = await prisma.sequence.create({
      data: { name, context: `A list of ${name}`, editable: true },
    });
  }

  for (const item of items) {
    // find or create our message for this element

    for (const itemData of [
      [item.key, item.name],
      [`${item.key}_desc`, item.description],
    ]) {
      let order = 0;

      const key = itemData[0];
      const value = itemData[1];
      if (!key || !value) continue;

      let message = await prisma.message.findFirst({
        where: { speaker: key, sequenceId: sequence.id },
      });
      if (!message) {
        message = await prisma.message.create({
          data: { order, speaker: key, sequenceId: sequence.id },
        });
      }

      // we'll delete all associated and just insert en
      await prisma.text.deleteMany({ where: { messageId: message.id } });
      await prisma.text.create({
        data: { text: value, languageId: 'en', messageId: message.id, checked: true },
      });

      order += 1;
    }
  }
}
