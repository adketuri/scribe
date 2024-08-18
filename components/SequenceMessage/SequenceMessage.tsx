import { Box, Button, Group, Text, Textarea } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Text as TextRecord } from '@prisma/client';
import { IconX } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface SequenceMessageProps {
  texts: TextRecord[];
  languageId: string;
  messageId: string;
  editable?: boolean;
  mutate?: () => void;
}
export function SequenceMessage({
  texts,
  languageId: language,
  messageId,
  editable,
  mutate,
}: SequenceMessageProps) {
  const textRecord = texts.find((t) => t.languageId === language);

  const [id, setId] = useState(textRecord?.id);
  const [text, setText] = useState(textRecord?.text || '');
  const [debouncedText] = useDebouncedValue(text, 1000);
  const ready = useRef<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editable) return;
    if (!ready.current) {
      ready.current = true;
    } else if (!id) {
      axios
        .post('api/texts', { text: debouncedText, languageId: language, messageId })
        .then((res) => setId(res.data.text.id));
    } else {
      axios.patch(`api/texts/${id}`, { text: debouncedText });
    }
  }, [debouncedText]);

  if (editable) {
    return (
      <Group>
        <Box flex={1}>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} autosize />
        </Box>
        <Button
          color="red"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            axios.delete(`api/messages/${messageId}`).then(() => mutate && mutate());
          }}
          px={5}
        >
          <IconX />
        </Button>
      </Group>
    );
  }

  return <Text>{text}</Text>;
}
