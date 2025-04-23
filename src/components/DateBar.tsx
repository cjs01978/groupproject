'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DateBar() {
  const router = useRouter();
  const today = new Date();

  // Date formatting options
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  // Format the date (e.g., "Tuesday, May 21, 2024")
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm">
      {/* Current Date Display */}
      <h2 className="text-xl font-semibold text-gray-800">
        {formattedDate}
      </h2>

      {/* Navigation to Monthly Calendar */}
      <Link
        href="/calendar/monthly"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        View Monthly Calendar
      </Link>
    </div>
  );
}
