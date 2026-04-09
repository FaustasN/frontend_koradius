"use client";
import { useTranslations} from "next-intl";
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
gsap.registerPlugin(useGSAP);
const Hero = () => {
  const t = useTranslations("HeroSection");
  const tl = useRef<GSAPTimeline | null>(null)
  const container = useRef<HTMLDivElement>(null)
 useGSAP(() => {
    tl.current = gsap.timeline({ paused: false, delay: 1 })
    gsap.set('.h1', { opacity: 0 })
    gsap.set('.h2', { opacity: 0 })
    gsap.set('.quick', { opacity: 0 })
      tl.current.to('.h1', 
        { opacity: 1, duration: 2, ease: 'power3.out' })
        tl.current.to('.h2',
          { opacity: 1, duration: 2, ease: 'power3.out' }, '-=1.5')
        tl.current.to('.quick',
          { opacity: 1, duration: 2, ease: 'power3.out' }, '-=1.5')

  }, { scope: container })

  return (
     <>
    <div ref={container}>
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt="Beautiful tropical destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center -mt-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="h1 text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-wide" style={{ 
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale'
          }}>
            {t('title')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-yellow-400 mt-2" style={{ 
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}>
            
            </span>
          </h1>

          {/* Subtitle */}
          <p className="h2 text-xl md:text-2xl text-white/90 mb-16 leading-relaxed max-w-3xl mx-auto">
            {t('subtitle')}
          </p>


          {/* Quick Stats */}
          <div className="quick mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">7+</div>
              <div className="text-lg">{t('yearsOfExperience')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">5000+</div>
              <div className="text-lg">{t('happyCustomers')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">50+</div>
              <div className="text-lg">{t('countries')}</div>
            </div>
          </div>
        </div>
      </div>
    
    </section>
    </div>
    </>
  );
};

export default Hero;