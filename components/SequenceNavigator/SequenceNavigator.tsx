'use client';

import { Button, Group } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import useSWR from 'swr';
import { Sequence } from '@prisma/client';
import { GetSequencesResponse } from '@/types/api';
import { fetcher } from '@/app/lib/fetcher';
import { useHashedSequence } from '@/app/hooks/useHashedSequence';

function getSequence(direction: number, sequenceName: string, sequences: Sequence[] | undefined) {
  if (!sequences) return undefined;
  const current = sequences.findIndex((seq) => seq.name === sequenceName);

  if (current === undefined) return undefined;

  if (direction === -1 && current <= 0) return undefined;
  if (direction === 1 && current >= sequences.length - 1) return undefined;
  return sequences[current + direction].name;
}

interface SequenceNavigatorProps {
  onOpenTableOfContents: () => void,
}

export function SequenceNavigator({ onOpenTableOfContents }: SequenceNavigatorProps) {
  const { data } = useSWR<GetSequencesResponse>('/api/sequences', fetcher);
  const sequenceName = useHashedSequence();
  const previous = getSequence(-1, sequenceName, data?.sequences);
  const next = getSequence(1, sequenceName, data?.sequences);
  return (
    <Group justify="space-between" py={16}>
      <Button
        component="a"
        href={`#${previous}`}
        data-disabled={!previous}
        onClick={(event) => !previous && event.preventDefault()}>
        <IconArrowLeft />
      </Button>
      <Button onClick={onOpenTableOfContents}>Table of Contents</Button>
      <Button
        component="a"
        href={`#${next}`}
        data-disabled={!next}
        onClick={(event) => !next && event.preventDefault()}>
        <IconArrowRight />
      </Button>
    </Group>);
}
