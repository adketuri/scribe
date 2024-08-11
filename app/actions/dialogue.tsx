import { assertAuthenticated } from './auth';

export async function sequences() {
  const authenticated = await assertAuthenticated();
  if (!authenticated) {
    throw new Error('Unauthorized access');
  }
  const records = await prisma?.sequence.findMany({ orderBy: { name: 'asc' } });
  return records;
}
