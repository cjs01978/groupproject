'use client';

import LoginForm from '@/components/LogInForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Welcome back!</h1>
      <LoginForm />
    </div>
  );
}