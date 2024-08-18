'use client';

import { Box, Card, Container, Grid, Blockquote, Text, Loader, Button } from '@mantine/core';
import useSWR from 'swr';
import { IconPlus } from '@tabler/icons-react';
import axios from 'axios';
import { useHashedSequence } from '@/app/hooks/useHashedSequence';
import { fetcher } from '@/app/lib/fetcher';
import { GetSequenceResponse } from '@/types/api';
import { useLanguage } from '@/app/hooks/useLanguage';
import { SequenceMessage } from '../SequenceMessage/SequenceMessage';

function formatSpeaker(speaker: string): string | undefined {
  if (speaker === '') return undefined;
  if (speaker === 'noone') return '';
  return `${speaker[0].charAt(0).toUpperCase() + speaker.slice(1)}`;
}

export function ActiveSequence() {
  const { language } = useLanguage();
  const localize = language && language?.id !== 'en';
  const sequenceName = useHashedSequence();

  const { data, error, mutate } = useSWR<GetSequenceResponse>(
    `/api/sequences/${sequenceName}`,
    fetcher
  );

  if (error) return <Container>OOPS</Container>;
  if (!data?.sequence) return <Loader />;

  const { sequence } = data;
  return (
    <Box py={100}>
      <Blockquote color="blue">{sequence.context}</Blockquote>
      {sequence.messages.map(({ speaker, texts, id }) => (
        <Card shadow="sm" radius="md" mt={16} withBorder>
          <Grid>
            <Grid.Col span={formatSpeaker(speaker) ? 2 : 0}>
              <Text c="dimmed">{formatSpeaker(speaker)}</Text>
            </Grid.Col>
            <Grid.Col span={localize ? 5 : 10}>
              <SequenceMessage
                texts={texts}
                languageId="en"
                messageId={id}
                editable={sequence.editable && !localize}
              />
            </Grid.Col>
            {localize && (
              <Grid.Col span={localize ? 5 : 10}>
                <SequenceMessage texts={texts} languageId={language.id} messageId={id} editable />
              </Grid.Col>
            )}
          </Grid>
        </Card>
      ))}
      {sequence.editable && (
        <Button
          onClick={() =>
            axios.post('api/messages', { sequenceId: sequence.id }).then(() => mutate())
          }
        >
          <IconPlus />
        </Button>
      )}
    </Box>
  );
}
