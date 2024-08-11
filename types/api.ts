import { Sequence } from '@prisma/client';

export interface GetSequencesResponse {
  sequences: Sequence[];
}
