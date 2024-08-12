'use client';

import { Container, Group, Text } from '@mantine/core';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/fetcher';
import { GetSequencesResponse } from '@/types/api';
import { TableOfContents } from '../TableOfContents/TableOfContents';

export function Sequences() {
  const { data, error } = useSWR<GetSequencesResponse>('/api/sequences', fetcher);
  if (error) return <Container>OOPS</Container>;

  return <Container><Group><TableOfContents /><Text>Main</Text></Group></Container>;
}
