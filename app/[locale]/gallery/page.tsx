import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

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
      title: 'Kelionių Kampas | Galerija',
      description:
        'Peržiūrėkite klientų kelionių nuotraukas ir atraskite įsimintinas akimirkas iš jų kelionių.',
    },
    en: {
      title: 'Kelionių Kampas | Gallery',
      description:
        'View trip photos shared by our customers and explore memorable moments from their travels.',
    },
    ru: {
      title: 'Kelionių Kampas | Галерея',
      description:
        'Просматривайте фотографии путешествий наших клиентов и открывайте яркие моменты их поездок.',
    },
  } as const;

  return {
    title: meta[locale].title,
    description: meta[locale].description,
    alternates: {
      canonical: `${BASE}/${locale}/gallery`,
      languages: {
        lt: `${BASE}/lt/gallery`,
        en: `${BASE}/en/gallery`,
        ru: `${BASE}/ru/gallery`,
        'x-default': `${BASE}/lt/gallery`,
      },
    },
  };
}

export default function GalleryPage() {
  return <GalleryClient />;
}