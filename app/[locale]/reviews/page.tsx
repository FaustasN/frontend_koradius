import type { Metadata } from 'next';
import ReviewsClient from './ReviewsClient';

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
      title: 'Kelionių Kampas | Atsiliepimai',
      description:
        'Skaitykite klientų atsiliepimus apie mūsų keliones ir paslaugas bei pasidalinkite savo patirtimi su Kelionių Kampu.',
    },
    en: {
      title: 'Kelionių Kampas | Reviews',
      description:
        'Read customer reviews about our trips and services, and share your own experience with Kelionių Kampas.',
    },
    ru: {
      title: 'Kelionių Kampas | Отзывы',
      description:
        'Читайте отзывы клиентов о наших поездках и услугах, а также поделитесь своим опытом с Kelionių Kampas.',
    },
  } as const;

  return {
    title: meta[locale].title,
    description: meta[locale].description,
    alternates: {
      canonical: `${BASE}/${locale}/reviews`,
      languages: {
        lt: `${BASE}/lt/reviews`,
        en: `${BASE}/en/reviews`,
        ru: `${BASE}/ru/reviews`,
        'x-default': `${BASE}/lt/reviews`,
      },
    },
  };
}

export default function ReviewPage() {
  return <ReviewsClient />;
}