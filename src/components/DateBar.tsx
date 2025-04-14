'use client';
import { useRouter } from 'next/navigation';

export default function DateBar() {
  const router = useRouter();

  return (
    <div className="flex justify-between mb-4">
      <p className="text-lg">Month, Day, Year Selected</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => router.push('/monthly')}
      >
        Go to Monthly View
      </button>
    </div>
  );
}
