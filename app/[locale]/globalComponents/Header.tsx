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

  const t = useTranslations("header");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
 setIsMenuOpen(false);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);
 
  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-xl py-2' : 'bg-white/95 backdrop-blur-md py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
         <Image
              src={logo}
              alt="Koradius Travel Logo"
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              priority
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors duration-300">
                Koradius
              </span>
              <span className="text-sm text-teal-600 font-medium -mt-1">
                Travel
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive('/') ? 'bg-teal-100 text-teal-700' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              {t('home')}
            </Link>

            <Link
              href="/search"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive('/search') ? 'bg-teal-100 text-teal-700' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              {t('searchTours')}
            </Link>

            <Link
              href="/gallery"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive('/gallery') ? 'bg-teal-100 text-teal-700' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              {t('gallery')}
            </Link>

            <Link
              href="/reviews"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive('/reviews') ? 'bg-teal-100 text-teal-700' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              {t('reviews')}
            </Link>

            <Link
              href="/about"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive('/about') ? 'bg-teal-100 text-teal-700' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              {t('about')}
            </Link>

            <Link
              href="/contact"
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                isActive('/contact') ? 'bg-teal-100 text-teal-700' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
              }`}
            >
              {t('contact')}
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
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
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="bg-white rounded-xl shadow-xl p-4 space-y-2 border border-gray-100">
            <Link href="/" className="block py-3 px-4 rounded-lg">
              {t('home')}
            </Link>
            <Link href="/search" className="block py-3 px-4 rounded-lg">
              {t('searchTours')}
            </Link>
            <Link href="/gallery" className="block py-3 px-4 rounded-lg">
              {t('gallery')}
            </Link>
            <Link href="/reviews" className="block py-3 px-4 rounded-lg">
              {t('reviews')}
            </Link>
            <Link href="/about" className="block py-3 px-4 rounded-lg">
              {t('about')}
            </Link>
            <Link href="/contact" className="block py-3 px-4 rounded-lg">
              {t('contact')}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}