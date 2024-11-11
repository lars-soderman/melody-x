'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signIn(email, password);
      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold">Log In</h2>
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              required
              className="w-full rounded-md border p-2"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="mb-2 block text-sm font-medium"
              htmlFor="password"
            >
              Password
            </label>
            <input
              required
              className="w-full rounded-md border p-2"
              id="password"
              minLength={6}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? 'Loading...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}
