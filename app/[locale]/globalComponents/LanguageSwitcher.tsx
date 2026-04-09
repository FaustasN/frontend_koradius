'use client';

import {useState, useRef, useEffect} from 'react';
import {useLocale} from 'next-intl';
import {usePathname, useRouter} from '@/i18n/navigation';
import {Globe} from 'lucide-react';

type LanguageCode = 'lt' | 'en' | 'ru';

const LANGUAGE_OPTIONS: {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}[] = [
  {code: 'lt', name: 'Lithuanian', nativeName: 'Lietuvių', flag: 'LT'},
  {code: 'en', name: 'English', nativeName: 'English', flag: 'EN'},
  {code: 'ru', name: 'Russian', nativeName: 'Русский', flag: 'RU'},
];

export default function LanguageSwitcher() {
  const locale = useLocale() as LanguageCode;
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const changeLocale = (nextLocale: LanguageCode) => {
    if (nextLocale === locale) return;
    router.replace(pathname, {locale: nextLocale});
    setOpen(false);
  };

  const currentLanguage = LANGUAGE_OPTIONS.find(l => l.code === locale);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 hover:border-teal-300 transition-all duration-300 shadow-sm"
      >
        <Globe size={18} className="text-teal-600" />
        <span className="text-teal-700 font-medium text-sm">
          {currentLanguage?.flag ?? 'EN'}
        </span>
      </button>

      <div
        className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 transition-all duration-200 ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="py-2">
          {LANGUAGE_OPTIONS.map((language) => (
            <button
              key={language.code}
              type="button"
              onClick={() => changeLocale(language.code)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3 ${
                locale === language.code
                  ? 'bg-teal-50 text-teal-600 font-medium'
                  : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>

              <div className="flex flex-col">
                <span className="font-medium">{language.name}</span>
                <span className="text-sm text-gray-500">
                  {language.nativeName}
                </span>
              </div>

              {locale === language.code && (
                <div className="ml-auto w-2 h-2 bg-teal-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}