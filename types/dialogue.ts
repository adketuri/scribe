export type LanguageCode = 'en' | 'es' | 'fr';

export interface Message {
  speaker: string;
  text: Record<'en' & Partial<LanguageCode>, string>;
}

export interface Dialogue {
  sequence: string;
  context: string;
  messages: Message[];
}
