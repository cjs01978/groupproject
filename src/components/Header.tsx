'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface HeaderProps {
  session: Session | null;
}

const Header = ({ session }: HeaderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!session?.user);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoggedIn(!!session?.user);
  }, [session]);

  const handleLoginLogout = async () => {
    if (isLoggedIn) {
      await signOut({callbackUrl: '/'});
    } else {
      // If already on login or signup, send home instead
      if (pathname === '/login' || pathname === '/signup') {
        router.push('/');
      } else {
        router.push('/login');
      }
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md py-4 px-6 mb-6 rounded-b-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">The Daily Dawg</h1>

        <div className="flex items-center gap-4">
          {isLoggedIn && session?.user ? (
            <>
              <span className="text-sm font-medium">
                Welcome, {session.user.name || session.user.email}
              </span>
              <button
                onClick={handleLoginLogout}
                className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={handleLoginLogout}
              className="bg-white text-blue-700 font-semibold px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              {pathname === '/login' || pathname === '/signup' ? 'Home' : 'Login'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
