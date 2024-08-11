'use client';

import { Container } from '@mantine/core';
import useSWR from 'swr';
import { fetcher } from '@/app/lib/fetcher';
import { GetSequencesResponse } from '@/types/api';

export function Sequences() {
  const { data, error } = useSWR<GetSequencesResponse>('/api/sequences', fetcher);
  if (error) return <Container>OOPS</Container>;

  return <Container>{JSON.stringify(data)}</Container>;
}
