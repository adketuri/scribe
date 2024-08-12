import { Divider, Text } from '@mantine/core';
import { Message } from '@/types/dialogue';

interface ScribeDialogueProps {
  messages: Message[]
  context?: string
}

function formatSpeaker(speaker: string): string {
  if (speaker === 'noone') {
    return '';
  }
  return `${speaker[0].charAt(0).toUpperCase() + speaker.slice(1)}: `;
}

export function ScribeDialogue({ messages, context }: ScribeDialogueProps) {
  return (
    <>
      {context && <h3>{context}</h3>}
      {messages.map(({ text, speaker }) =>
        (<Text mb={5}><b>{formatSpeaker(speaker)}</b>{text.en}</Text>))}
      <Divider mt={20} />
    </>);
}
