import { useState } from 'react';
import { Button, Input } from '@mantine/core';
import axios from 'axios';

export function AddLanguage() {
  const [value, setValue] = useState('');

  return (
    <>
      <Input placeholder="Language" value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        disabled={value.trim().length <= 0}
        onClick={() => axios.post('/api/languages', { languageId: value }).then(() => setValue(''))}
      >
        Add Language
      </Button>
    </>
  );
}
