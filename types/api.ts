import { Prisma, Sequence } from '@prisma/client';

export interface GetSequencesResponse {
  sequences: Sequence[];
}

export type SequenceWithMessages = Prisma.SequenceGetPayload<{
  include: { messages: { include: { texts: true } } };
}>;

export interface GetSequenceResponse {
  sequence: SequenceWithMessages;
}
