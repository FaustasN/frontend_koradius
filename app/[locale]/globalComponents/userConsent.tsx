'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

const CONSENT_KEY = 'koradius_cookie_consent';
const CONSENT_CHANGE_EVENT = 'koradius_cookie_consent_change';

const gaId = process.env.NEXT_PUBLIC_GA_ID;
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

type ConsentValue = 'accepted' | 'declined';

function isConsentValue(value: string | null): value is ConsentValue {
  return value === 'accepted' || value === 'declined';
}

function getConsentSnapshot(): ConsentValue | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return isConsentValue(value) ? value : null;
  } catch {
    return null;
  }
}

function getServerSnapshot(): ConsentValue | null {
  return null;
}

function subscribeToConsentChange(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener(CONSENT_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
  };
}

function writeConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
  } catch {
    return;
  }
}

export default function UserConsent() {
  const t = useTranslations('userConsent');

  const consent = useSyncExternalStore(
    subscribeToConsentChange,
    getConsentSnapshot,
    getServerSnapshot,
  );

  const handleAccept = (): void => {
    writeConsent('accepted');
  };

  const handleDecline = (): void => {
    writeConsent('declined');
  };

  return (
    <>
      {consent === 'accepted' ? (
        <>
          {gaId ? <GoogleAnalytics gaId={gaId} /> : null}
          {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
        </>
      ) : null}

      {consent === null ? (
        <div className="fixed inset-x-0 bottom-0 z-[60]">
          <div className="mx-auto max-w-6xl px-4 pb-4">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 sm:text-base">
                    {t('title')}
                  </div>

                  <div className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">
                    {t('description')}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <button
                    type="button"
                    onClick={handleDecline}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors duration-200 hover:bg-gray-50"
                  >
                    {t('decline')}
                  </button>

                  <button
                    type="button"
                    onClick={handleAccept}
                    className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-teal-700"
                  >
                    {t('accept')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}