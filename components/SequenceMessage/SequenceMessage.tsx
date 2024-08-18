import { Text, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Text as TextRecord } from '@prisma/client';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface SequenceMessageProps {
  texts: TextRecord[];
  languageId: string;
  messageId: string;
  editable?: boolean;
}
export function SequenceMessage({
  texts,
  languageId: language,
  messageId,
  editable,
}: SequenceMessageProps) {
  const textRecord = texts.find((t) => t.languageId === language);

  //if (!textRecord) throw new Error(`Could not find text record with language ${language}`);
  const [id, setId] = useState(textRecord?.id);
  const [text, setTextContents] = useState(textRecord?.text || '');
  const [debouncedText] = useDebouncedValue(text, 2000);
  const ready = useRef<boolean>(false);

  useEffect(() => {
    if (!editable) return;
    if (!ready.current) {
      ready.current = true;
    } else if (!id) {
      axios
        .post('api/texts', { text: debouncedText, languageId: language, messageId })
        .then((res) => {
          console.log('GOT RES', res);
          setId(res.data.text.id);
        });
    } else {
      axios.post(`api/texts/${id}`, { text: debouncedText });
    }
  }, [debouncedText]);

  if (editable) {
    return <Textarea value={text} onChange={(e) => setTextContents(e.target.value)} autosize />;
  }

  return <Text>{text}</Text>;
}
