'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DateBar() {
  const router = useRouter();
  const today = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow border border-black">
      {/* Current Date */}
      <h2 className="text-xl font-serif font-bold text-gray-900">
        {formattedDate}
      </h2>

      {/* Monthly Calendar Navigation */}
      <Link
        href="/calendar/monthly/edit"
        className="px-4 py-2 bg-[#BA0C2F] text-white font-medium rounded-md hover:bg-red-800 transition-colors"
      >
        View Monthly Calendar
      </Link>
    </div>
  );
}
