"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { paymentsAPI, type Payment } from "../../services/adminApiService";

export default function AdminPaymentsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      loadPayments();
    }
  }, [isLoading, isAuthenticated]);

  const loadPayments = async () => {
    try {
      setLoadingPayments(true);
      setError("");
      const data = await paymentsAPI.getAll();
      setPayments(data);
    } catch {
      setError("Nepavyko gauti mokėjimų.");
    } finally {
      setLoadingPayments(false);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "paid":
        return "Apmokėtas";
      case "pending":
        return "Laukiama";
      case "failed":
        return "Nepavykęs";
      case "cancelled":
        return "Atšauktas";
      case "refunded":
        return "Grąžintas";
      default:
        return status;
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-gray-100 text-gray-700";
      case "refunded":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("lt-LT", {
      style: "currency",
      currency: currency || "EUR",
    }).format(amount / 100);
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
            <h1 className="text-2xl font-semibold text-gray-900">Mokėjimų valdymas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Peržiūrėkite visus klientų užsakymus ir mokėjimų būsenas
            </p>
          </div>

          <button
            onClick={() => router.push("/admin")}
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

        {loadingPayments ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            Kraunami mokėjimai...
          </div>
        ) : payments.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            Mokėjimų nerasta.
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {payment.travel_packet_title || "Nepiskirtas paketas"}
                      </h2>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                        {formatAmount(payment.amount, payment.currency)}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs ${getStatusClasses(
                          payment.status
                        )}`}
                      >
                        {getStatusLabel(payment.status)}
                      </span>

                      {payment.is_test && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700">
                          Testinis
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-500">Order ID: {payment.order_id}</p>

                    {payment.description && (
                      <p className="mt-1 text-sm text-gray-500">{payment.description}</p>
                    )}

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Mokėjimo būdas
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {payment.payment_method || "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Paysera status
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {payment.paysera_status ?? "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-400">
                          Travel packet ID
                        </p>
                        <p className="mt-1 text-sm font-medium text-gray-800">
                          {payment.travel_packet_id ?? "—"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-gray-400">Sukurta</p>
                        <p className="text-sm text-gray-700">
                          {new Date(payment.created_at).toLocaleString("lt-LT")}
                        </p>
                      </div>

                      {payment.paid_at && (
                        <div>
                          <p className="text-xs text-gray-400">Apmokėta</p>
                          <p className="text-sm text-gray-700">
                            {new Date(payment.paid_at).toLocaleString("lt-LT")}
                          </p>
                        </div>
                      )}

                      {payment.failed_at && (
                        <div>
                          <p className="text-xs text-gray-400">Nepavyko</p>
                          <p className="text-sm text-gray-700">
                            {new Date(payment.failed_at).toLocaleString("lt-LT")}
                          </p>
                        </div>
                      )}
                    </div>

                    {(payment.customer_email_encrypted ||
                      payment.customer_name_encrypted ||
                      payment.customer_phone_encrypted) && (
                      <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="mb-2 text-sm font-medium text-gray-800">
                          Kliento informacija
                        </p>

                        <div className="space-y-1 text-sm text-gray-600">
                          {payment.customer_name_encrypted && (
                            <p>Vardas: {payment.customer_name_encrypted}</p>
                          )}
                          {payment.customer_email_encrypted && (
                            <p>El. paštas: {payment.customer_email_encrypted}</p>
                          )}
                          {payment.customer_phone_encrypted && (
                            <p>Telefonas: {payment.customer_phone_encrypted}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full lg:w-auto">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600">
                      <p className="font-medium text-gray-800">Būsena</p>
                      <p className="mt-1">{getStatusLabel(payment.status)}</p>
                    </div>
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