import { Text, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import axios from 'axios';
import { useState, useRef, useEffect } from 'react';

function formatSpeaker(speaker: string, editable: boolean): string | undefined {
  if (speaker === '') return undefined;
  if (speaker === 'noone') return '';
  if (editable) return speaker;
  return `${speaker[0].charAt(0).toUpperCase() + speaker.slice(1)}`;
}

interface SequenceSpeakerProps {
  messageId: string;
  speaker: string;
  editable: boolean;
}

export function SequenceSpeaker({
  messageId,
  speaker: initialSpeaker,
  editable,
}: SequenceSpeakerProps) {
  const [speaker, setSpeaker] = useState(initialSpeaker || '');
  const [debouncedSpeaker] = useDebouncedValue(speaker, 1000);
  const ready = useRef<boolean>(false);

  useEffect(() => {
    if (!editable) return;
    if (!ready.current) {
      ready.current = true;
    } else {
      axios.patch(`api/messages/${messageId}`, { speaker: debouncedSpeaker });
    }
  }, [debouncedSpeaker]);

  if (editable) {
    return <Textarea value={speaker} onChange={(e) => setSpeaker(e.target.value)} autosize />;
  }

  return <Text c="dimmed">{formatSpeaker(speaker, editable)}</Text>;
}
