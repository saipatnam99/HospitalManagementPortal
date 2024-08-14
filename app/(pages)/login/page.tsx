"use client";

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import gsap from 'gsap';

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
      console.log(res)

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

  useEffect(() => {
    gsap.fromTo(
      '.login-form',
      { y: '100vh', opacity: 0 },
      { y: '0', opacity: 1, duration: 2, ease: 'power3.out' }
    );
  }, []);

  return (
    <div
      className="grid place-items-center h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://st2.depositphotos.com/36924814/46071/i/450/depositphotos_460713580-stock-photo-medical-health-blue-cross-neon.jpg')",
      }}
    >
      <div className="login-form bg-black bg-opacity-20 p-5 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-xl font-bold mb-4 text-center text-black">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="p-3 border border-gray-300 rounded-lg bg-black bg-opacity-20 placeholder-white text-white focus:outline-none focus:ring-2"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="p-3 border border-gray-300 rounded-lg bg-black bg-opacity-20 placeholder-white text-white focus:outline-none focus:ring-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-black font-bold px-6 py-2 rounded-lg shadow-lg transition duration-300 hover:bg-blue-700"
          >
            Login with Credentials
          </button>
          <button
            type="button"
            onClick={() => signIn('google')}
            className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg mt-3 transition duration-300 hover:bg-red-700"
          >
            Login with Google
          </button>
          <Link href="/signup" className="text-sm mt-3 text-center text-white">
            Don&#39;t have an account? <span className="underline">Sign Up</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
