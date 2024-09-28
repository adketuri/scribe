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

export interface LocalizedItem {
  key: string;
  name: string;
  description?: string;
}

export interface DialogueFile {
  dialogues: Dialogue[];
  items: LocalizedItem[];
  skills: LocalizedItem[];
  augments: LocalizedItem[];
  maps: LocalizedItem[];
  passives: LocalizedItem[];
  monsters: LocalizedItem[];
  statuses: LocalizedItem[];
}
