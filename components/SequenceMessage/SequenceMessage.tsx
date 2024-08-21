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
  mutate: () => void;
  editable?: boolean;
  deletable?: boolean;
}
export function SequenceMessage({
  texts,
  languageId: language,
  messageId,
  editable,
  deletable,
  mutate,
}: SequenceMessageProps) {
  const textRecord = texts.find((t) => t.languageId === language);

  const [id, setId] = useState(textRecord?.id);
  const [text, setText] = useState(textRecord?.text || '');
  const [debouncedText] = useDebouncedValue(text, 1000);
  const [loading, setLoading] = useState(false);

  // Patch text data when our debounced text updates.
  // Note, explicitly don't mutate here because it triggers a full
  // rerender which disrupts text entry.
  const ready = useRef<boolean>(false);
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

  // Maintain a reference to the text and debounced text
  // On unmount we'll push a patch if we need to update,
  // so we don't lose any pending changes
  const cleanupRef = useRef({ text, debouncedText });
  useEffect(() => {
    cleanupRef.current = { text, debouncedText };
  }, [text, debouncedText]);
  useEffect(
    () => () => {
      const { text: textRef, debouncedText: debouncedTextRef } = cleanupRef.current;
      if (textRef !== debouncedTextRef) {
        if (id) {
          axios.patch(`api/texts/${id}`, { text: textRef }).then(mutate).catch(console.error);
        } else {
          axios
            .post('api/texts', { text: textRef, languageId: language, messageId })
            .then(mutate)
            .catch(console.error);
        }
      } else {
        mutate();
      }
    },
    []
  );

  if (editable) {
    return (
      <Group>
        <Box flex={1}>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} autosize />
        </Box>
        {deletable && (
          <Button
            color="red"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              axios.delete(`api/messages/${messageId}`).then(mutate);
            }}
            px={5}
          >
            <IconX />
          </Button>
        )}
      </Group>
    );
  }

  return <Text>{text}</Text>;
}
