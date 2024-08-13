'use client';

import { Box, Card, Container, Grid, Blockquote, Text, Loader } from '@mantine/core';
import useSWR from 'swr';
import { useHashedSequence } from '@/app/hooks/useHashedSequence';
import { fetcher } from '@/app/lib/fetcher';
import { GetSequenceResponse } from '@/types/api';
import { useLanguage } from '@/app/hooks/useLanguage';

function formatSpeaker(speaker: string): string {
  if (speaker === 'noone') return '';
  return `${speaker[0].charAt(0).toUpperCase() + speaker.slice(1)}`;
}

export function ActiveSequence() {
  const { language } = useLanguage();
  const localize = language && language?.id !== 'en';
  const sequenceName = useHashedSequence();

  const { data, error } = useSWR<GetSequenceResponse>(`/api/sequences/${sequenceName}`, fetcher);

  if (error) return <Container>OOPS</Container>;
  if (!data?.sequence) return <Loader />;

  const { sequence } = data;
  return (
    <Box>
      <Blockquote color="blue">
        {sequence.context}
      </Blockquote>
      {sequence.messages.map(({ speaker, texts }) => (
        <Card shadow="sm" radius="md" mt={16} withBorder>
          <Grid>
            <Grid.Col span={2}>
              <Text c="dimmed">
                {formatSpeaker(speaker)}
              </Text>
            </Grid.Col>
            <Grid.Col span={localize ? 5 : 10}>
              <Text>
                {texts.find(t => t.languageId === 'en')?.text.replaceAll('|', '\n')}
              </Text>
            </Grid.Col>
            {localize &&
              <Grid.Col span={localize ? 5 : 10}>
                <Text>
                  {texts.find(t => t.languageId === language.id)?.text.replaceAll('|', '\n')}
                </Text>
              </Grid.Col>}
          </Grid>
        </Card>))}
    </Box>
  );
}
