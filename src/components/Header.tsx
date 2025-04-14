'use client';
import { useRouter } from 'next/navigation';

type Props = {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
};

export default function Header({ isLoggedIn, setIsLoggedIn }: Props) {
  const router = useRouter();

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false); // Just toggle to Login (no navigation)
    } else {
      setIsLoggedIn(true);  // Toggle to Logout
      router.push('/login'); // And navigate to login page
    }
  };

  return (
    <div className="flex justify-between items-center border-b pb-4 mb-6">
      <h1 className="text-2xl font-bold">Title of Page</h1>
      <button
        onClick={handleLoginLogout}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
    </div>
  );
}
