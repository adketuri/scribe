'use client';

import { Box, Button, Container, FileInput, Space } from '@mantine/core';
import axios from 'axios';
import { useActionState, useEffect, useState } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { GetOutputResponse, TransformedOutput } from '@/types/api';
import { useLanguage } from '@/app/hooks/useLanguage';
import { logout } from '@/app/actions/auth';
import { importDialogue } from '@/app/actions/import';
import { AddLanguage } from '../AddLanguage/AddLanguage';
import { AddSequence } from '../AddSequence/AddSequence';

async function download(id: string) {
  const response = await axios.get<GetOutputResponse>(`api/output/${id}`, {
    withCredentials: true,
  });

  const transformed: TransformedOutput = {};
  response.data.sequences.forEach((sequence) => {
    if (sequence.editable) {
      transformed[sequence.name] = {};
      sequence.messages.forEach((message) => {
        (transformed[sequence.name] as Record<string, string>)[message.speaker] =
          message.texts.find((text) => text.languageId === id)!.text;
      });
    } else {
      transformed[sequence.name] = sequence.messages.map((message) => ({
        speaker: message.speaker,
        text: message.texts.find((text) => text.languageId === id)!.text,
      }));
    }
  });

  const data = new Blob([JSON.stringify(transformed, null, 2)], { type: 'application/json' });
  const href = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', `${id}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Admin() {
  const { languages } = useLanguage();
  const [, action, pending] = useActionState(importDialogue, undefined);
  const [value, setValue] = useState<File | null>(null);

  const searchParams = useSearchParams();
  const reset = searchParams.get('reset');

  const [, logoutAction, logoutPending] = useActionState(logout, undefined);

  useEffect(() => {
    if (reset) {
      setValue(null);
      redirect('/admin');
    }
  }, [reset]);

  return (
    <Container size="xs">
      <Space h={100} />
      {languages?.map(({ id }) => (
        <Button key={id} onClick={() => download(id)}>
          Download ({id})
        </Button>
      ))}
      <form action={action}>
        <FileInput
          accept="application/json"
          label="Upload json"
          placeholder="Upload json"
          id="dialogue"
          name="dialogue"
          value={value}
          onChange={setValue}
        />
        <Button type="submit" mt="xl" disabled={pending || !value}>
          {pending ? 'Submitting...' : 'Upload'}
        </Button>
      </form>
      <Box mt={20}>
        <AddLanguage />
      </Box>
      <Box mt={20}>
        <AddSequence />
      </Box>{' '}
      <form action={logoutAction}>
        <Button type="submit" mt="xl" disabled={logoutPending}>
          {logoutPending ? 'Submitting...' : 'Logout'}
        </Button>
      </form>
    </Container>
  );
}
