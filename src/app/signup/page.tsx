'use client';

import SignupForm from '@/components/SignupForm';

export default function SignupPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Create an Account</h1>
      <SignupForm />
    </div>
  );
}
