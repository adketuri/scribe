'use client';

import { Box, Card, Container, Grid, Blockquote, Loader, Button, Group } from '@mantine/core';
import useSWRImmutable from 'swr';
import { IconPlus } from '@tabler/icons-react';
import axios from 'axios';
import { useState } from 'react';
import { useHashedSequence } from '@/app/hooks/useHashedSequence';
import { fetcher } from '@/app/lib/fetcher';
import { GetSequenceResponse } from '@/types/api';
import { useLanguage } from '@/app/hooks/useLanguage';
import { SequenceMessage } from '../SequenceMessage/SequenceMessage';
import { SequenceSpeaker } from '../SequenceSpeaker/SequenceSpeaker';
import { useAuth } from '@/app/hooks/useAuth';
import { TranslateButton } from '../TranslateButton/TranslateButton';

export function ActiveSequence() {
  const { language } = useLanguage();
  const sequenceName = useHashedSequence();
  const editKey = !sequenceName.includes('.') && language === 'en';
  const localize = Boolean(language && language !== 'en');

  const { data, error, mutate } = useSWRImmutable<GetSequenceResponse>(
    `/api/sequences/${sequenceName}`,
    fetcher
  );

  const [loading, setLoading] = useState(false);
  const user = useAuth();

  if (error) return <Container>OOPS</Container>;
  if (!data?.sequence) return <Loader />;

  const { sequence } = data;
  return (
    <Box py={100} key={language}>
      <Group align="start">
        <Blockquote flex={1} color="blue">
          {sequence.context}
        </Blockquote>
        {user?.role === 'admin' && <TranslateButton sequenceName={sequenceName} />}
      </Group>
      {sequence.messages.map(({ speaker, texts, id }) => (
        <Card shadow="sm" radius="md" mt={16} withBorder key={id}>
          <Grid>
            <Grid.Col span={2}>
              <SequenceSpeaker messageId={id} editable={editKey} speaker={speaker} />
            </Grid.Col>
            <Grid.Col span={localize ? 5 : 10}>
              <SequenceMessage
                texts={texts}
                languageId="en"
                messageId={id}
                deletable={sequence.editable}
                editable={sequence.editable && !localize}
                mutate={mutate}
              />
            </Grid.Col>
            {localize && (
              <Grid.Col span={localize ? 5 : 10}>
                <SequenceMessage
                  texts={texts}
                  languageId={language}
                  messageId={id}
                  mutate={mutate}
                  editable={user?.role !== 'viewer'}
                />
              </Grid.Col>
            )}
          </Grid>
        </Card>
      ))}
      {user?.role === 'admin' && (
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
