import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {routing} from '@/i18n/routing';
import Header from './globalComponents/Header';
import ScrollToTop from './globalComponents/ScrollToTop';
import Footer from './globalComponents/Footer';
import UserConsent from './globalComponents/userConsent';
import { Metadata } from 'next';
import { GoogleAnalytics } from "@next/third-parties/google";
const gaId = process.env.NEXT_PUBLIC_GA_ID;

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>;

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <>
      <NextIntlClientProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
        <UserConsent />
      </NextIntlClientProvider>
      {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
    </>
  );
}
export const metadata: Metadata = {
  title: 'Kelionių Kampas | Home',
  description: 'Kelionių Kampas is a travel agency offering carefully selected leisure and sightseeing trips. Discover popular travel packages, attractive prices, and convenient online booking.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}