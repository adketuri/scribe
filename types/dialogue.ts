export type LanguageCode = 'en' | 'es' | 'fr' | 'ja';

export type TextRecord = Partial<Record<LanguageCode, string>>;
export interface Message {
  speaker: string;
  text: TextRecord;
}

export interface Dialogue {
  sequence: string;
  context: string;
  messages: Message[];
}
