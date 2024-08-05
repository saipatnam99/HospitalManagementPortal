"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import gsap from 'gsap';

export default function SignupForm() {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Signup successful! Now, hurry up and log in before the magic disappears!');
        router.replace('/login'); // Redirect to login page
      } else {
        toast.error(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    gsap.fromTo(
      '.signup-form',
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
      <div className="signup-form bg-black bg-opacity-20 p-5 rounded-lg shadow-lg border border-gray-200">
        <h1 className="text-xl font-bold mb-4 text-center text-white">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg bg-black bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
            required
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg bg-black bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg bg-black bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg bg-black bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg bg-black bg-opacity-20 text-white placeholder-white focus:outline-none focus:ring-2"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-black font-bold px-6 py-2 rounded-lg shadow-lg transition duration-300 hover:bg-blue-700"
          >
            Sign Up
          </button>
          <Link href="/login" className="text-sm mt-3 text-center text-white">
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
