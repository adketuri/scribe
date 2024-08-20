import { Autocomplete, Group, Modal } from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import useSWR from 'swr';
import { useState } from 'react';
import { GetSequencesResponse } from '@/types/api';
import { fetcher } from '@/app/lib/fetcher';

export function QuickSearch() {
  const { data } = useSWR<GetSequencesResponse>('/api/sequences', fetcher);

  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState('');
  useHotkeys(
    [
      ['mod+K', open],
      ['Enter', () => onSubmit(value)],
    ],
    []
  );
  const onSubmit = (submission: string) => {
    if (!open) return;
    if (data?.sequences.some((s) => s.name === submission)) {
      window.location.replace(`/#${submission}`);
      setValue('');
      close();
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false} size="sm" yOffset={140}>
        <Group>
          <IconSearch size={36} />
          <Autocomplete
            size="lg"
            data-autofocus
            placeholder="Search"
            data={data?.sequences.map((s) => s.name)}
            value={value}
            onChange={setValue}
            onOptionSubmit={(v) => onSubmit(v)}
          />
        </Group>
      </Modal>
    </>
  );
}
