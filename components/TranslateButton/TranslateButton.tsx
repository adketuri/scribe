import { Button, Checkbox, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBook } from '@tabler/icons-react';
import axios from 'axios';
import { FC, useState } from 'react';
import useSWR from 'swr';
import { GetSequenceResponse } from '@/types/api';
import { fetcher } from '@/app/lib/fetcher';

interface TranslateButtonProps {
  sequenceName: string;
}
export const TranslateButton: FC<TranslateButtonProps> = ({ sequenceName }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const { mutate } = useSWR<GetSequenceResponse>(`/api/sequences/${sequenceName}`, fetcher);
  return (
    <>
      <Button variant="subtle" px={8} onClick={open}>
        <IconBook />
      </Button>
      <Modal opened={opened} onClose={close} title="Auto-Translate" size="xs">
        <Checkbox
          mb={20}
          label="Overwrite existing translations"
          checked={checked}
          onChange={(e) => setChecked(e.currentTarget.checked)}
        />
        <Button
          loading={loading}
          fullWidth
          onClick={() => {
            setLoading(true);
            axios
              .post(`api/sequences/${sequenceName}/autotranslate`, { override: checked })
              .then(() => {
                mutate();
                close();
              });
          }}
        >
          Translate
        </Button>
      </Modal>
    </>
  );
};
