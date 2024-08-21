/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const RESERVED_SEQUENCE_NAMES = ['speakers', 'ui', 'items', 'skills', 'file'];

async function main() {
  try {
    const lang = await prisma.lang.createManyAndReturn({
      data: [{ id: 'en' }, { id: 'ja' }],
    });
    console.log('Created languages: ', lang);
  } catch (e) {
    console.log('Languages exist, skipping');
  }

  try {
    await prisma.sequence.createMany({
      data: [
        {
          name: 'file_window',
          context: 'File operation window text',
          editable: true,
        },
        { name: 'input_window', context: 'Input options', editable: true },
      ],
    });
    await prisma.sequence.createMany({
      data: [
        {
          name: 'speakers',
          context: 'Names for characters that speak during dialogue.',
          editable: true,
        },
        { name: 'ui', context: 'UI elements in menus', editable: true },
        { name: 'items', context: 'Item name and descriptions', editable: true },
        { name: 'skills', context: 'Skill name and descriptions', editable: true },
      ],
    });
    console.log('Created editables');
  } catch (e) {
    console.log('Editable sequences exist, skipping');
  }
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
