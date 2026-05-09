import type { Metadata } from 'next';
import ContactClient from './ContactClient';

type Props = {
  params: Promise<{
    locale: 'lt' | 'en' | 'ru';
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const BASE =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kelioniukampas.lt';

  const meta = {
    lt: {
      title: 'Kelionių Kampas | Kontaktai',
      description:
        'Palikite savo klausimus ir susisiekite su mūsų komanda dėl kelionių, užsakymų ir kelionių informacijos.',
    },
    en: {
      title: 'Kelionių Kampas | Contact us',
      description:
        'Leave your questions and contact our team for help with trips, bookings, and travel information.',
    },
    ru: {
      title: 'Kelionių Kampas | Контакты',
      description:
        'Оставьте свои вопросы и свяжитесь с нашей командой по вопросам поездок, бронирования и туристической информации.',
    },
  } as const;

  return {
    title: meta[locale].title,
    description: meta[locale].description,
    alternates: {
      canonical: `${BASE}/${locale}/contact`,
      languages: {
        lt: `${BASE}/lt/contact`,
        en: `${BASE}/en/contact`,
        ru: `${BASE}/ru/contact`,
        'x-default': `${BASE}/lt/contact`,
      },
    },
  };
}

export default function ContactPage() {
  return <ContactClient />;
}