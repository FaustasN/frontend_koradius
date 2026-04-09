  import { Link } from '@/i18n/navigation';
  import { useTranslations } from 'next-intl';
  import Image from 'next/image';
  import logo from '@/app/public/Koradiuslogo.png';

  const Footer = () => {
    const t = useTranslations('FooterSection');

    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-10 sm:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              {/* Brand */}
              <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={logo}
                    alt="Koradius Travel Logo"
                    className="h-10 w-auto object-contain"
                    priority
                  />
                  <span className="text-xl sm:text-2xl font-bold">Koradius Travel</span>
                </div>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-sm">
                  {t('companyInfo.mission')}
                </p>
              </div>

              {/* Quick Links */}
              <div className="w-full max-w-xs mx-auto lg:mx-0">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-center lg:text-left">
                  {t('quickLinks.title')}
                </h3>

                <ul className="space-y-2.5 text-center lg:text-left">
                  <li>
                    <Link
                      href="/"
                      className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      {t('quickLinks.home')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/search"
                      className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      {t('quickLinks.tours')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/gallery"
                      className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      {t('quickLinks.gallery')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/reviews"
                      className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      {t('quickLinks.reviews')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      {t('quickLinks.about')}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors duration-300"
                    >
                      {t('quickLinks.contact')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="w-full max-w-xs mx-auto lg:mx-0">
                <div className="rounded-lg border border-red-700/40 bg-red-900/20 p-3 text-center lg:text-left">
                  <h4 className="text-sm font-semibold text-red-300 mb-1">
                    {t('contact.emergencyHelp.title')}
                  </h4>
                  <p className="text-xs sm:text-sm text-red-200 leading-relaxed">
                    {t('contact.emergencyHelp.description')}
                  </p>
                  <p className="text-sm font-semibold text-red-100 mt-1">
                    +370 694 98078
                  </p>
                </div>
                <div className="flex justify-center gap-3 mt-5">
                  <a
                    href="https://www.facebook.com/groups/289826933663379"
                    className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-full transition-all duration-300 hover:scale-105"
                    aria-label="Facebook"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6h1.5V4.8c-.3 0-1.2-.1-2.3-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.7v8h2.8Z" />
                    </svg>
                  </a>

                  <a
                    href="https://www.instagram.com/koradius_keliones"
                    className="bg-pink-600 hover:bg-pink-700 p-2.5 rounded-full transition-all duration-300 hover:scale-105"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4 mt-8 text-center">
              <p className="text-xs sm:text-sm text-gray-400">
                {t('bottomFooter.copyright')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    );
  };

  export default Footer;