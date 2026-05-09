import type { Metadata } from 'next';
import AboutClient from './AboutClient';

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
      title: 'Kelionių Kampas | Apie mus',
      description:
        'Sužinokite daugiau apie Kelionių Kampo patirtį, vertybes ir teikiamas kelionių paslaugas.',
    },
    en: {
      title: 'Kelionių Kampas | About us',
      description:
        'Learn more about Kelionių Kampas, our experience, values, and travel services.',
    },
    ru: {
      title: 'Kelionių Kampas | О нас',
      description:
        'Узнайте больше о Kelionių Kampas, нашем опыте, ценностях и туристических услугах.',
    },
  } as const;

  return {
    title: meta[locale].title,
    description: meta[locale].description,
    alternates: {
      canonical: `${BASE}/${locale}/about`,
      languages: {
        lt: `${BASE}/lt/about`,
        en: `${BASE}/en/about`,
        ru: `${BASE}/ru/about`,
        'x-default': `${BASE}/lt/about`,
      },
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}