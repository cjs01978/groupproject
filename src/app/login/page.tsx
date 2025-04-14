'use client';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Login Page</h1>
      <p>This will be the login page.</p>
      <button
        onClick={handleSignIn}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign In
      </button>
    </div>
  );
}
