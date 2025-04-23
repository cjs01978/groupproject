'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import CalendarView from '@/components/CalendarView';

export default function MonthlyViewPage() {
  const { status } = useSession();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (status === 'authenticated') {
      router.replace('monthly/edit');
    }
  }, [hydrated, status, router]);

  if (!hydrated || status === 'loading' || status === 'authenticated') {
    return null;
  }

  return <CalendarView />;
}
