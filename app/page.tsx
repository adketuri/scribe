'use client';

import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { Sequences } from '@/components/Sequences/Sequences';

export default function HomePage() {
  return (
    <>
      <ColorSchemeToggle />
      <Sequences />
    </>
  );
}
