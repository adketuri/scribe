import { Lang, Message, Prisma, Sequence } from '@prisma/client';

export type SequencesWithMessages = Prisma.SequenceGetPayload<{
  include: { messages: { include: { texts: { where: { languageId: string } } } } };
}>;

export interface GetOutputResponse {
  sequences: SequencesWithMessages[];
}

export type TransformedMessage = Omit<Message, 'id' | 'sequenceId' | 'order'> & { text: string };
export type TransformedOutput = Record<string, Record<string, string> | Array<TransformedMessage>>;

export interface GetSequencesResponse {
  sequences: Sequence[];
}

export type SequenceWithMessages = Prisma.SequenceGetPayload<{
  include: { messages: { include: { texts: true } } };
}>;

export interface GetSequenceResponse {
  sequence: SequenceWithMessages;
}

export interface GetLanguagesResponse {
  languages: Lang[];
}
