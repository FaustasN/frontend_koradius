import type { Metadata } from "next";
import Hero from "./components/Hero";
import WhyChooseUs from "./components/WhyChooseUs";
import QuickStats from "./components/QuickStats";
import Header from "./globalComponents/Header";
import FeaturedToursWithPayment from "./components/FeaturedToursWithPayment";
import { routing } from "@/i18n/routing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        lt: `${SITE_URL}/lt`,
        en: `${SITE_URL}/en`,
        ru: `${SITE_URL}/ru`,
        "x-default": `${SITE_URL}/${routing.defaultLocale}`,
      },
    },
  };
}

export default function HomePage() {

  return (
    <div>
     <Header/>
      <Hero />
      <FeaturedToursWithPayment/>
      <WhyChooseUs />
      <QuickStats />
    </div>
  );
}
