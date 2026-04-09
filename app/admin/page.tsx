'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPage() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.replace('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <p className="text-gray-600 text-sm sm:text-base">Kraunama...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Admin panelė
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Valdykite sistemos turinį ir administravimo veiksmus
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Atsijungti
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <button
            onClick={() => router.push('/admin/travel-packets')}
            className="rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Kelionių paketai
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Administruok kelionių paketus.
            </p>
          </button>

          <button
            onClick={() => router.push('/admin/reviews')}
            className="rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Atsiliepimai
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Peržiūrėti, patvirtinti arba atmesti klientų atsiliepimus.
            </p>
          </button>

          <button
            onClick={() => router.push('/admin/gallery')}
            className="rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">Galerija</h2>
            <p className="mt-2 text-sm text-gray-500">
              Čia galėsi pridėti, redaguoti ir šalinti nuotraukas.
            </p>
          </button>

          <button
            onClick={() => router.push('/admin/payments')}
            className="rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">Mokėjimai</h2>
            <p className="mt-2 text-sm text-gray-500">
              Vieta mokėjimų valdymui.
            </p>
          </button>

          <button
            onClick={() => router.push('/admin/server')}
            className="rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:border-gray-300 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Serverio informacija
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Čia galėsi peržiūrėti serverio informaciją ir statistiką.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}