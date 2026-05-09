import type { Metadata } from 'next';
import SearchClient from './SearchClient';

type Props = {
  params: Promise<{
    locale: 'lt' | 'en' | 'ru';
  }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kelioniukampas.lt';

  const meta = {
    lt: {
      title: 'Kelionių Kampas | Novaturo kelionių paieška',
      description:
        'Ieškokite kelionių pasiūlymų iš mūsų partnerio Novaturo ir atraskite patogias kelionių kryptis.',
    },
    en: {
      title: 'Kelionių Kampas | Novaturas Search',
      description:
        'Browse travel deals from our partner Novaturas and discover convenient travel options for your next trip.',
    },
    ru: {
      title: 'Kelionių Kampas | Поиск Novaturas',
      description:
        'Просматривайте туристические предложения от нашего партнера Novaturas и выбирайте удобные варианты путешествий.',
    },
  } as const;

  return {
    title: meta[locale].title,
    description: meta[locale].description,
    alternates: {
      canonical: `${BASE}/${locale}/search`,
      languages: {
        lt: `${BASE}/lt/search`,
        en: `${BASE}/en/search`,
        ru: `${BASE}/ru/search`,
        'x-default': `${BASE}/lt/search`,
      },
    },
  };
}
export default function SearchPage() {
  return <SearchClient/>;
}