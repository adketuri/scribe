'use client';

import { Button, Divider } from '@mantine/core';
import axios from 'axios';
import { GetOutputResponse, TransformedOutput } from '@/types/api';
import { useLanguage } from '../hooks/useLanguage';

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

export default function LoginPage() {
  const { languages } = useLanguage();

  return (
    <>
      {languages?.map(({ id }) => (
        <Button key={id} onClick={() => download(id)}>
          Download ({id})
        </Button>
      ))}
      <Divider />
    </>
  );
}
