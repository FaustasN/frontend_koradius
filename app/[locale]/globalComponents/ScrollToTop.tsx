'use client';

import {useEffect, useState} from 'react';
import {ChevronUp} from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateVisibility = () => {
      setIsVisible(window.scrollY > 250);
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener('scroll', onScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-xl ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : 'translate-y-3 opacity-0 scale-95 pointer-events-none'
      }`}
      aria-label="Grįžti į viršų"
    >
      <ChevronUp size={24} />
    </button>
  );
};

export default ScrollToTop; 