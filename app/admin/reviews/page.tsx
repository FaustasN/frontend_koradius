'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { reviewsAPI, type Review } from '../../services/adminApiService';

export default function AdminReviewsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      loadReviews();
    }
  }, [isLoading, isAuthenticated]);

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      setError('');
      const data = await reviewsAPI.getAll();
      setReviews(data);
    } catch {
      setError('Nepavyko gauti atsiliepimų.');
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setActionLoadingId(id);
      await reviewsAPI.approve(id);
      await loadReviews();
    } catch {
      setError('Nepavyko patvirtinti atsiliepimo.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: number) => {
    try {
      setActionLoadingId(id);
      await reviewsAPI.unapprove(id);
      await loadReviews();
    } catch {
      setError('Nepavyko atmesti atsiliepimo.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setActionLoadingId(id);
      await reviewsAPI.delete(id);
      await loadReviews();
    } catch {
      setError('Nepavyko ištrinti atsiliepimo.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <p className="text-gray-600">Kraunama...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Atsiliepimų valdymas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Patvirtinkite, atmeskite arba ištrinkite klientų atsiliepimus
            </p>
          </div>

          <button
            onClick={() => router.push('/admin')}
            className="rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Grįžti
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loadingReviews ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            Kraunami atsiliepimai...
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            Atsiliepimų nerasta.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">{review.name}</h2>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                        {review.rating}/5
                      </span>

                      {review.is_approved ? (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          Patvirtintas
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700">
                          Nepatvirtintas
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">{review.email}</p>

                    {review.trip_reference && (
                      <p className="mt-1 text-sm text-gray-500">
                        Kelionės nr.: {review.trip_reference}
                      </p>
                    )}

                    <p className="mt-4 text-gray-700 leading-relaxed">{review.comment}</p>

                    <p className="mt-4 text-xs text-gray-400">
                      Sukurta: {new Date(review.created_at).toLocaleString('lt-LT')}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                    {!review.is_approved && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        disabled={actionLoadingId === review.id}
                        className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-60"
                      >
                        {actionLoadingId === review.id ? 'Vykdoma...' : 'Patvirtinti'}
                      </button>
                    )}

                    {review.is_approved && (
                      <button
                        onClick={() => handleReject(review.id)}
                        disabled={actionLoadingId === review.id}
                        className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-3 text-sm font-medium text-yellow-700 transition hover:bg-yellow-100 disabled:opacity-60"
                      >
                        {actionLoadingId === review.id ? 'Vykdoma...' : 'Atmesti'}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={actionLoadingId === review.id}
                      className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                    >
                      {actionLoadingId === review.id ? 'Vykdoma...' : 'Ištrinti'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}