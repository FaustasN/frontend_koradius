'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const success = await login(username, password);

    if (success) {
      router.replace('/admin');
    } else {
      setError('Neteisingas prisijungimo vardas arba slaptažodis.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="flex items-center gap-3 text-gray-700">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm sm:text-base">Kraunama...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="px-6 sm:px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                Dasboard prisijungimas
              </h1>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Prisijungimo vardas
                </label>

                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="username"
                    type="text"
                    placeholder="Įveskite vardą"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:bg-white"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Slaptažodis
                </label>

                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Įveskite slaptažodį"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-400 focus:bg-white"
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-2xl bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                Prisijungti
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}