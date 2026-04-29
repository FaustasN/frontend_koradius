'use client';

import { useRef, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const CONSENT_KEY = 'koradius_cookie_consent';
const CONSENT_EVENT = 'koradius_cookie_consent_change';

type ConsentValue = 'accepted' | 'declined';

function readConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);

    if (raw === 'accepted' || raw === 'declined') {
      return raw;
    }

    return null;
  } catch {
    return null;
  }
}

function writeConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  } catch {
    // ignore storage failures
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(CONSENT_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot() {
  return readConsent();
}

function getServerSnapshot() {
  return null;
}

export default function UserConsent() {
  const t = useTranslations('userConsent');
  const bannerRef = useRef<HTMLDivElement>(null);

  const consent = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useGSAP(() => {
    if (consent || !bannerRef.current) return;

    gsap.fromTo(
      bannerRef.current,
      {
        opacity: 0,
        y: 24,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out',
      }
    );
  }, [consent]);

  if (consent) return null;

  const accept = () => {
    writeConsent('accepted');
  };

  const decline = () => {
    writeConsent('declined');
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60]">
      <div className="mx-auto max-w-6xl px-4 pb-4">
        <div
          ref={bannerRef}
          className="rounded-2xl border border-gray-200 bg-white shadow-2xl"
        >
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
                onClick={decline}
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 transition-colors duration-200 hover:bg-gray-50"
              >
                {t('decline')}
              </button>

              <button
                type="button"
                onClick={accept}
                className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-teal-700"
              >
                {t('accept')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}