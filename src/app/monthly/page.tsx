'use client';
import { useRouter } from 'next/navigation';

export default function MonthlyPage() {
  const router = useRouter();

  const handleReturnHome = () => {
    router.push('/');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Monthly View</h1>
      <p>This will display the calendar view.</p>
      <button
        onClick={handleReturnHome}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Return to Home
      </button>
    </div>
  );
}
