'use client';

import { Container, Group, Text } from '@mantine/core';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/fetcher';
import { GetSequencesResponse } from '@/types/api';
import { TableOfContents } from '../TableOfContents/TableOfContents';
import { useHashedSequence } from '@/app/hooks/useHashedSequence';

export function Sequences() {
  const sequence = useHashedSequence();

  const { data, error } = useSWR<GetSequencesResponse>(`/api/sequences/${sequence}`, fetcher);

  if (error) return <Container>OOPS</Container>;

  return (
    <Container>
      <Group>
        <TableOfContents />
        <Text>{JSON.stringify(data)}</Text>
      </Group>
    </Container>);
}
