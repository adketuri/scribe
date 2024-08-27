/* eslint-disable no-continue */

'use server';

import { redirect } from 'next/navigation';
import prisma from '../lib/database';
import { Dialogue, TextRecord } from '@/types/dialogue';
import { RESERVED_SEQUENCE_NAMES } from '@/scripts/seed';

export async function importDialogue(state: any, formData: FormData) {
  const inputFile = formData.get('dialogue') as File;
  const input: Dialogue[] = JSON.parse(await inputFile.text());

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
    .filter((s) => !RESERVED_SEQUENCE_NAMES.includes(s.name))
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
