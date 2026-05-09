import type { Metadata } from 'next';

import Hero from './components/Hero';
import WhyChooseUs from './components/WhyChooseUs';
import QuickStats from './components/QuickStats';
import FeaturedToursWithPayment from './components/FeaturedToursWithPayment';
import { routing } from '@/i18n/routing';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
  'https://www.kelioniukampas.lt';

type Locale = 'lt' | 'en' | 'ru';

type HomePageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  const meta = {
    lt: {
      title: 'Kelionių Kampas | Pradžia',
      description:
        'Kelionių Kampas – kelionių agentūra, siūlanti kruopščiai atrinktas poilsines ir pažintines keliones. Atraskite populiarius kelionių pasiūlymus, patrauklias kainas ir patogų užsakymą internetu.',
    },
    en: {
      title: 'Kelionių Kampas | Home',
      description:
        'Kelionių Kampas is a travel agency offering carefully selected leisure and sightseeing trips. Discover popular travel packages, attractive prices, and convenient online booking.',
    },
    ru: {
      title: 'Kelionių Kampas | Главная',
      description:
        'Kelionių Kampas — туристическое агентство, предлагающее тщательно подобранные пляжные и экскурсионные поездки. Найдите популярные туры, выгодные цены и удобное онлайн-бронирование.',
    },
  } as const;

  return {
    title: meta[locale].title,
    description: meta[locale].description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        lt: `${SITE_URL}/lt`,
        en: `${SITE_URL}/en`,
        ru: `${SITE_URL}/ru`,
        'x-default': `${SITE_URL}/${routing.defaultLocale}`,
      },
    },
  };
}

export default function HomePage() {
  return (
    <div>
      <Hero />
      <FeaturedToursWithPayment />
      <WhyChooseUs />
      <QuickStats />
    </div>
  );
}