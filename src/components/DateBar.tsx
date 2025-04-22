'use client';
import { useRouter } from 'next/navigation';

export default function DateBar() {
  const router = useRouter();

  return (
    <div className="flex justify-between mb-4">
      <p className="text-lg">Month, Day, Year Selected</p>
    </div>
  );
}
