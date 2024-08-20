'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Admin from '@/components/Admin/Admin';
import { HeaderMenu } from '@/components/HeaderMenu/HeaderMenu';

export default function AdminPage() {
  const router = useRouter();

  return (
    <>
      <HeaderMenu onClickHeader={() => router.push('/')} />
      <Suspense>
        <Admin />
      </Suspense>
    </>
  );
}
