'use client';

import { Button } from '@mantine/core';
import { useLanguage } from '../hooks/useLanguage';

const InnerComponent = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <>
      {language}
      <Button onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}>Set</Button>
    </>
  );
};
export default function DebugPage() {
  return (
    <>
      <InnerComponent />
      <InnerComponent />
      <InnerComponent />
      <InnerComponent />
      <InnerComponent />
    </>
  );
}
