'use client';

import { Button, Divider, FileInput } from '@mantine/core';
import axios from 'axios';
import { useActionState } from 'react';
import { GetOutputResponse, TransformedOutput } from '@/types/api';
import { useLanguage } from '../hooks/useLanguage';
import { importDialogue } from '../actions/import';

async function download(id: string) {
  const response = await axios.get<GetOutputResponse>(`api/output/${id}`, {
    withCredentials: true,
  });

  const transformed: TransformedOutput = {};
  response.data.sequences.forEach((sequence) => {
    transformed[sequence.name] = sequence.messages.map((message) => ({
      speaker: message.speaker,
      text: message.texts.find((text) => text.languageId === id)!.text,
    }));
  });
  const data = new Blob([JSON.stringify(transformed, null, 2)], { type: 'application/json' });
  const href = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', `output-${id}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function AdminPage() {
  const { languages } = useLanguage();
  const [state, action, pending] = useActionState(importDialogue, undefined);

  return (
    <>
      {languages?.map(({ id }) => (
        <Button key={id} onClick={() => download(id)}>
          Download ({id})
        </Button>
      ))}
      <Divider />
      <form action={action}>
        <FileInput
          accept="application/json"
          label="Upload json"
          placeholder="Upload json"
          id="dialogue"
          name="dialogue"
        />
        <Button type="submit" mt="xl" disabled={pending}>
          {pending ? 'Submitting...' : 'Upload'}
        </Button>
      </form>
    </>
  );
}
