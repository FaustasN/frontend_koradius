'use client';

import {useState, useEffect} from 'react';
import {Menu, X, Phone} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import Image from 'next/image';
import logo from '@/app/public/Koradiuslogo.png';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const t = useTranslations('header');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {href: '/', label: t('home')},
    {href: '/search', label: t('searchTours')},
    {href: '/gallery', label: t('gallery')},
    {href: '/reviews', label: t('reviews')},
    {href: '/about', label: t('about')},
    {href: '/contact', label: t('contact')}
  ];

  const isActive = (path: string) => pathname === path;

  const desktopLinkClass = (path: string) =>
    `px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
      isActive(path)
        ? 'bg-teal-100 text-teal-700'
        : 'text-gray-800 hover:bg-teal-50 hover:text-teal-600'
    }`;

  const mobileLinkClass = (path: string) =>
    `block py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
      isActive(path)
        ? 'bg-teal-100 text-teal-700'
        : 'text-gray-800 hover:bg-teal-50 hover:text-teal-600'
    }`;

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-2' : 'bg-white shadow-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center space-x-3 group min-w-0"
            onClick={closeMenu}
          >
            <Image
              src={logo}
              alt="Koradius Travel Logo"
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              priority
            />

            <div className="flex flex-col min-w-0">
              <span className="text-2xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors duration-300 leading-none">
                Koradius
              </span>
              <span className="text-sm text-teal-600 font-medium leading-none mt-1">
                Travel
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={desktopLinkClass(item.href)}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <a
              href="tel:+37069498078"
              className="hidden md:flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 rounded-lg border border-red-200 transition-all duration-300"
            >
              <Phone size={16} />
              <span className="text-sm font-semibold whitespace-nowrap">
                24/7: +370 694 98078
              </span>
            </a>

            <LanguageSwitcher />

            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-[500px] mt-4' : 'max-h-0'
          }`}
        >
          <nav className="bg-white rounded-xl shadow-xl p-4 space-y-2 border border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={mobileLinkClass(item.href)}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}