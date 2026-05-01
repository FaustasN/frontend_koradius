import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import PurchaseSuccessClient from "./PurchaseSuccessClient";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const t = await getTranslations("featuredTours");
  const resolvedSearchParams = await searchParams;
  const orderId =
    resolvedSearchParams?.orderId ??
    resolvedSearchParams?.order_id ??
    resolvedSearchParams?.orderNumber ??
    resolvedSearchParams?.order;
  const normalizedOrderId = Array.isArray(orderId) ? orderId[0] : orderId;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          {t("paymentSection.bookingConfirmed")}
        </h1>
        <p className="text-gray-600">
          {t("paymentSection.bookingConfirmed2")}
        </p>
        {normalizedOrderId ? (
          <p className="text-gray-700 font-medium mt-4">
            {t("paymentSection.orderInfo")} {normalizedOrderId}
          </p>
        ) : null}
        <Link
          href="/"
          className="inline-flex items-center justify-center mt-8 px-8 py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-colors"
        >
          {t("paymentSection.backToHome")}
        </Link>
      </div>
      <PurchaseSuccessClient />
    </div>
  );
}