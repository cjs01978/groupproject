'use client';
import { useRouter } from 'next/navigation';

export default function DateBar() {
  const router = useRouter();

  // Get the current date
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <div className="flex justify-between mb-4">
      <p className="text-lg">{formattedDate}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => router.push('/monthly')}
      >
        Go to Monthly View
      </button>
    </div>
  );
}
