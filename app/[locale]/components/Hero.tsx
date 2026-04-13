"use client";

import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import Image from "next/image";
import heroPhoto from "@/app/public/Koradius_Cover.jpg";

gsap.registerPlugin(useGSAP);

const Hero = () => {
  const t = useTranslations("HeroSection");
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.to(".h1", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      })
        .to(
          ".h2",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          },
          "-=0.45"
        )
        .to(
          ".quick",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
          },
          "-=0.45"
        );
    },
    { scope: container }
  );

  return (
    <div ref={container}>
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28"
      >
        <div className="absolute inset-0">
          <Image
            src={heroPhoto}
            alt="Beautiful tropical destination"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1
              className="h1 opacity-0 translate-y-5 text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight tracking-wide"
              style={{
                fontFamily:
                  'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                textRendering: "optimizeLegibility",
                WebkitFontSmoothing: "antialiased",
                MozOsxFontSmoothing: "grayscale"
              }}
            >
              {t("title")}
            </h1>

            <p className="h2 opacity-0 translate-y-5 text-lg sm:text-xl md:text-2xl text-white/90 mb-10 md:mb-16 leading-relaxed max-w-3xl mx-auto">
              {t("subtitle")}
            </p>

            <div className="quick opacity-0 translate-y-5 mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">7+</div>
                <div className="text-lg">{t("yearsOfExperience")}</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">5000+</div>
                <div className="text-lg">{t("happyCustomers")}</div>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">50+</div>
                <div className="text-lg">{t("countries")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;