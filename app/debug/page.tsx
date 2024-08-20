'use client';

import { Button } from '@mantine/core';
import { useLanguage } from '../hooks/useLanguage';

export default function DebugPage() {
  const { language, setLanguage } = useLanguage();

  console.log('Render');

  return (
    <>
      {language}
      <Button onClick={() => setLanguage('ja')}>Set</Button>
    </>
  );
}
