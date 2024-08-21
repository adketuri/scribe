import { useState } from 'react';
import { Button, Input } from '@mantine/core';
import axios from 'axios';

export function AddSequence() {
  const [name, setName] = useState('');
  const [context, setContext] = useState('');

  return (
    <>
      <Input placeholder="Sequence Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input
        placeholder="Sequence Context"
        value={context}
        onChange={(e) => setContext(e.target.value)}
      />
      <Button
        type="submit"
        disabled={name.trim().length <= 0 || context.trim().length <= 0}
        onClick={() =>
          axios.post('/api/sequences', { context, name }).then(() => {
            setContext('');
            setName('');
          })
        }
      >
        Add Sequence
      </Button>
    </>
  );
}
