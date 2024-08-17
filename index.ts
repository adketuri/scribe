// /* eslint-disable no-continue */
// import { promises as fs } from 'fs';
// import * as path from 'path';

// type LanguageCode = 'en' | 'es' | 'fr' | 'ja';

// interface Message {
//   speaker: string;
//   text: Record<'en' & Partial<LanguageCode>, string>;
// }
// interface Dialogue {
//   sequence?: string;
//   context?: string;
//   messages: Message[];
// }

// async function readFiles(dir: string): Promise<Dialogue[]> {
//   const dialogues: Dialogue[] = [];

//   async function readFilesInner(innerDir: string) {
//     const files = await fs.readdir(innerDir);
//     for (const file of files) {
//       const filePath = path.join(innerDir, file);
//       const stats = await fs.stat(filePath);

//       if (stats.isDirectory()) {
//         await readFilesInner(filePath);
//       } else if (stats.isFile()) {
//         if (file.endsWith('.txt')) {
//           const data = await fs.readFile(filePath, 'utf8');
//           const lines = data.split('\n');
//           if (!lines.some((l) => l.startsWith('show_message'))) continue;
//           // show_message("Your arrogance will be your downfall.", esteri)
//           const context = lines.find((l) => l.includes('Context:'));
//           const sequence = lines.find((l) => l.includes('Sequence:'));
//           dialogues.push({
//             context: context?.split(':')[1].trim(),
//             sequence: sequence?.split(':')[1].trim(),
//             messages: lines
//               .filter((l) => l.startsWith('show_message'))
//               .map((l) => {
//                 const split = l.split('"');
//                 let speaker = 'noone';
//                 if (split[2].includes(',')) {
//                   speaker = split[2].split(',')[1].trim().replace(')', '');
//                 }
//                 return {
//                   speaker,
//                   text: { en: split[1] },
//                 };
//               }),
//           });
//         } else if (file === 'chatter.json') {
//           const data = await fs.readFile(filePath, 'utf8');
//           const chatter = JSON.parse(data);
//           Object.values(chatter)
//             .filter((v: any) => v.dialogue)
//             .forEach((v: any) => {
//               dialogues.push({
//                 context: v.context,
//                 sequence: v.sequence,
//                 messages: v.dialogue.map((d: string) => ({
//                   speaker: d.split('|')[0],
//                   text: { en: d.split('|')[1] },
//                 })),
//               });
//             });
//         }
//       }
//     }
//   }
//   await readFilesInner(dir);
//   return dialogues;
// }

// async function main() {
//   const dialogues = await readFiles('../starlessumbra/starlessumbra/datafiles');
//   const markedDialogues = dialogues
//     .filter((d) => d.sequence)
//     .sort((d1, d2) => d1.sequence!.localeCompare(d2.sequence!));
//   console.log(`${markedDialogues.length}/${dialogues.length} events marked.`);
//   await fs.writeFile('output.json', JSON.stringify(markedDialogues));
//   console.log('Done!');
// }

// main();
