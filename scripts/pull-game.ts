import { promises as fs } from 'fs';
import * as path from 'path';
import { Dialogue, LocalizedItem } from '@/types/dialogue';

function isMessage(value: string): boolean {
  return (
    value.startsWith('show_message') || value.startsWith('chat') || value.startsWith('show_choice')
  );
}

async function readFiles(initialDir: string): Promise<Dialogue[]> {
  const dialogues: Dialogue[] = [];

  async function readFilesInner(dir: string) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        await readFilesInner(filePath);
      } else if (stats.isFile()) {
        if (file.endsWith('.txt')) {
          const data = await fs.readFile(filePath, 'utf8');
          const lines = data.split('\n');
          // eslint-disable-next-line no-continue
          if (!lines.some(isMessage)) continue;

          // show_message("Your arrogance will be your downfall.", esteri)
          const context = lines.find((l) => l.includes('Context:'));
          const sequence = lines.find((l) => l.includes('Sequence:'));

          dialogues.push({
            context: context?.split(':')[1].trim() || 'missing',
            sequence: sequence?.split(':')[1].trim() || 'missing',
            messages: lines.filter(isMessage).map((l) => {
              const split = l.split('"');
              let speaker = 'noone';
              try {
                if (split[2].includes(',')) {
                  speaker = split[2].split(',')[1].trim().replace(')', '');
                }
              } catch (e) {
                console.log('No speaker for line', l);
              }
              return {
                speaker,
                text: { en: split[1] },
              };
            }),
          });
        } else if (file === 'chatter.json') {
          const data = await fs.readFile(filePath, 'utf8');
          const chatter = JSON.parse(data);
          Object.values(chatter)
            .filter((v: any) => v.dialogue)
            .forEach((v: any) => {
              dialogues.push({
                context: v.context,
                sequence: v.sequence,
                messages: v.dialogue.map((d: string) => ({
                  speaker: d.split('|')[0],
                  text: { en: d.split('|')[1] },
                })),
              });
            });
        }
      }
    }
  }
  await readFilesInner(initialDir);
  return dialogues;
}

async function getSpecial(filename: string) {
  const items = JSON.parse(
    await fs.readFile(`../starlessumbra/starlessumbra/datafiles/db/${filename}.json`, 'utf8')
  );
  let added = 0;
  const markedItems: LocalizedItem[] = [];
  Object.entries(items).forEach(([key, value]: [key: string, value: any]) => {
    const { name, description } = value;
    if (name) {
      markedItems.push({ key, name, description });
      added += 1;
    }
  });
  console.log(`Added ${added} ${filename}`);
  return markedItems;
}

async function main() {
  const dialogues = await readFiles('../starlessumbra/starlessumbra/datafiles/');
  const markedDialogues = dialogues
    .filter((d) => d.sequence)
    .sort((a, b) => {
      const aParts = a.sequence.split('.').map(Number);
      const bParts = b.sequence.split('.').map(Number);
      for (let i = 0; i < 3; i += 1) {
        if (aParts[i] !== bParts[i]) {
          return aParts[i] - bParts[i];
        }
      }
      return 0;
    })
    .filter((d) => d.sequence !== 'missing');
  console.log(`${markedDialogues.length}/${dialogues.length} events marked.`);

  const items = await getSpecial('items');
  const skills = await getSpecial('skills');
  const augments = await getSpecial('augments');
  const maps = await getSpecial('maps');
  const passives = await getSpecial('passives');
  const monsters = await getSpecial('monsters');
  const statuses = await getSpecial('status_effects');

  await fs.writeFile(
    '../su-output.json',
    JSON.stringify(
      { dialogues: markedDialogues, items, skills, augments, maps, passives, monsters, statuses },
      null,
      2
    )
  );
  console.log('Done!');
}

main();
