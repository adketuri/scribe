/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const lang = await prisma.lang.createManyAndReturn({
      data: [{ id: 'en' }, { id: 'ja' }],
    });
    console.log('Created languages: ', lang);
  } catch (e) {
    console.error(e);
    console.log('Error with languages, skipping');
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
      ],
    });
    console.log('Created editables');
  } catch (e) {
    console.error(e);
    console.log('Error with sequences, skipping');
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
