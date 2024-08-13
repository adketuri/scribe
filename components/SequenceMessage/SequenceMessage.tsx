import { Text, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Text as TextRecord } from '@prisma/client';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface SequenceMessageProps {
  texts: TextRecord[],
  language: string,
  editable?: boolean,
}
export function SequenceMessage({ texts, language, editable }: SequenceMessageProps) {
  const textRecord = texts.find(t => t.languageId === language);

  if (!textRecord) throw new Error(`Could not find text record with language ${language}`);

  const { id, text } = textRecord;

  const [textContents, setTextContents] = useState(text);
  const [debouncedText] = useDebouncedValue(textContents, 2000);
  const ready = useRef<boolean>(false);

  useEffect(() => {
    if (!editable) return;
    if (!ready.current) {
      ready.current = true;
    } else {
      axios.post(`api/texts/${id}`, { text: debouncedText });
    }
  }, [debouncedText]);

  if (editable) {
    return <Textarea
      value={textContents}
      onChange={(e) => setTextContents(e.target.value)}
      autosize
    />;
  }

  return (
    <Text>
      {textContents}
    </Text>
  );
}
