"use client";
import { Shield, Heart, Award, Clock, Users, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const WhyChooseUs = () => {
  const t = useTranslations("WhyChooseUsSection");
  const tl = useRef<GSAPTimeline | null>(null);
  const tl2 = useRef<GSAPTimeline | null>(null);
  const container = useRef<HTMLDivElement>(null);

 useGSAP(() => {
  gsap.set('.h1', { opacity: 0, y: 40 });
  gsap.set('.h2', { opacity: 0, y: 40 });
  gsap.set('.feature-card', { opacity: 0, y: 40 });

  tl.current = gsap.timeline({
    paused: false,
    scrollTrigger: {
      trigger: container.current,
      start: 'center 30%',
      toggleActions: 'play none none none'
      // markers: true,
    },
    onComplete: () => {
      tl2.current = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });

      tl2.current
        .to('.p1', { scale: 1.2, duration: 0.35, ease: 'power1.out' })
        .to('.p1', { scale: 1, duration: 1, ease: 'power1.inOut' })

        .to('.p2', { scale: 1.2, duration: 0.35, ease: 'power1.out' }, '+=0.05')
        .to('.p2', { scale: 1, duration: 1, ease: 'power1.inOut' })

        .to('.p3', { scale: 1.2, duration: 0.35, ease: 'power1.out' }, '+=0.05')
        .to('.p3', { scale: 1, duration: 1, ease: 'power1.inOut' })

        .to('.p4', { scale: 1.2, duration: 0.35, ease: 'power1.out' }, '+=0.05')
        .to('.p4', { scale: 1, duration: 1, ease: 'power1.inOut' });
    }
  });

  tl.current
    .to('.h1', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out'
    })
    .to(
      '.h2',
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      },
      '-=0.6'
    )
    .to(
      '.feature-card',
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
      },
      '-=0.4'
    );
}, { scope: container });

  const features = [
    {
      icon: Heart,
      title: t('features.customerCare.title'),
      description: t('features.customerCare.description'),
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      icon: Shield,
      title: t('features.reliability.title'),
      description: t('features.reliability.description'),
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Award,
      title: t('features.highQuality.title'),
      description: t('features.highQuality.description'),
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Clock,
      title: t('features.support24_7.title'),
      description: t('features.support24_7.description'),
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: Users,
      title: t('features.lithuanianTeam.title'),
      description: t('features.lithuanianTeam.description'),
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Globe,
      title: t('features.wideNetwork.title'),
      description: t('features.wideNetwork.description'),
      color: "text-teal-500",
      bgColor: "bg-teal-50"
    }
  ];

  return (
    <div ref={container}>
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="h1 text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              {t('title')}
            </h2>
            <p className="h2 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="feature-card grid bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group btn-hover-smooth"
                >
                  <div className={`${feature.bgColor} w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={feature.color} size={32} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-teal-600 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-16 bg-white rounded-3xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="p1">
                <div className="text-4xl font-bold text-teal-600 mb-2">7+</div>
                <div className="text-gray-600">{t('trustIndicators.yearsExperience')}</div>
              </div>
              <div className="p2">
                <div className="text-4xl font-bold text-teal-600 mb-2">5000+</div>
                <div className="text-gray-600">{t('trustIndicators.happyCustomers')}</div>
              </div>
              <div className="p3">
                <div className="text-4xl font-bold text-teal-600 mb-2">98%</div>
                <div className="text-gray-600">{t('trustIndicators.customerSatisfaction')}</div>
              </div>
              <div className="p4">
                <div className="text-4xl font-bold text-teal-600 mb-2">50+</div>
                <div className="text-gray-600">{t('trustIndicators.countries')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhyChooseUs;