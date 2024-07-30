// app/login/page.tsx
"use client";

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error('Invalid Credentials');
        return;
      }

      toast.success('Login Successful');
      router.replace('/dashboard');
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('An error occurred while logging in.');
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-4 border-blue-600 bg-opacity-50">
        <h1 className="text-xl font-bold my-4">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            className="p-2 border border-black rounded-lg bg-transparent"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="p-2 border border-gray-300 rounded-lg bg-transparent"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-bold px-6 py-2 rounded-lg"
          >
            Login with Credentials
          </button>
          <button
            type="button"
            onClick={() => signIn('google')}
            className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg mt-3"
          >
            Login with Google
          </button>
          <Link href="/signup" className="text-sm mt-3 text-right">
            Don&apos;t have an account? <span className="underline">Sign Up</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
