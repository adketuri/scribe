'use client';

import { Box, Card, Container, Grid, Blockquote, Loader, Button } from '@mantine/core';
import useSWR from 'swr';
import { IconPlus } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHashedSequence } from '@/app/hooks/useHashedSequence';
import { fetcher } from '@/app/lib/fetcher';
import { GetSequenceResponse } from '@/types/api';
import { useLanguage } from '@/app/hooks/useLanguage';
import { SequenceMessage } from '../SequenceMessage/SequenceMessage';
import { SequenceSpeaker } from '../SequenceSpeaker/SequenceSpeaker';

export function ActiveSequence() {
  const { language } = useLanguage();
  console.log('!AK lang', language);

  useEffect(() => {
    console.log('!AK goo Language changed:', language);
  }, [language]);

  const localize = language && language !== 'en';
  const sequenceName = useHashedSequence();

  const { data, error, mutate } = useSWR<GetSequenceResponse>(
    `/api/sequences/${sequenceName}`,
    fetcher
  );

  const [loading, setLoading] = useState(false);

  if (error) return <Container>OOPS</Container>;
  if (!data?.sequence) return <Loader />;

  const { sequence } = data;
  return (
    <Box py={100}>
      <Blockquote color="blue">{sequence.context}</Blockquote>
      {sequence.messages.map(({ speaker, texts, id }) => (
        <Card shadow="sm" radius="md" mt={16} withBorder key={id}>
          <Grid>
            <Grid.Col span={2}>
              <SequenceSpeaker
                messageId={id}
                editable={sequence.editable && !localize}
                speaker={speaker}
              />
            </Grid.Col>
            <Grid.Col span={localize ? 5 : 10}>
              <SequenceMessage
                texts={texts}
                languageId="en"
                messageId={id}
                editable={sequence.editable && !localize}
                mutate={mutate}
              />
            </Grid.Col>
            {localize && (
              <Grid.Col span={localize ? 5 : 10}>
                <SequenceMessage texts={texts} languageId={language} messageId={id} editable />
              </Grid.Col>
            )}
          </Grid>
        </Card>
      ))}
      {sequence.editable && !localize && (
        <Button
          mt={15}
          disabled={loading}
          onClick={() => {
            setLoading(true);
            axios.post('api/messages', { sequenceId: sequence.id }).then(() => {
              mutate();
              setLoading(false);
            });
          }}
          rightSection={<IconPlus size={20} />}
        >
          Add Line
        </Button>
      )}
    </Box>
  );
}
