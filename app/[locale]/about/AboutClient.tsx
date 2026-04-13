"use client";

import { useMemo, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { Award, Globe, Heart, Shield, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AboutClient() {
  const router = useRouter();
  const t = useTranslations("about");
  const container = useRef<HTMLDivElement>(null);

  const cardClass =
    "bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2";

  const actionButtonPrimaryClass =
    "bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg";

  const actionButtonSecondaryClass =
    "border-2 border-teal-500 hover:bg-teal-500 hover:text-white text-teal-600 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105";

  const values = useMemo(
    () => [
      {
        icon: Heart,
        title: t("values.customerCare.title"),
        description: t("values.customerCare.description"),
      },
      {
        icon: Shield,
        title: t("values.reliability.title"),
        description: t("values.reliability.description"),
      },
      {
        icon: Globe,
        title: t("values.experience.title"),
        description: t("values.experience.description"),
      },
      {
        icon: Clock,
        title: t("values.support24_7.title"),
        description: t("values.support24_7.description"),
      },
    ],
    [t]
  );

  const achievements = useMemo(
    () => [
      {
        number: "7+",
        label: t("achievements.yearsExperience.label"),
        description: t("achievements.yearsExperience.description"),
      },
      {
        number: "5000+",
        label: t("achievements.happyCustomers.label"),
        description: t("achievements.happyCustomers.description"),
      },
      {
        number: "50+",
        label: t("achievements.countries.label"),
        description: t("achievements.countries.description"),
      },
      {
        number: "98%",
        label: t("achievements.customerSatisfaction.label"),
        description: t("achievements.customerSatisfaction.description"),
      },
    ],
    [t]
  );

  const certifications = useMemo(
    () => [
      {
        icon: Award,
        title: t("certifications.ltkia.title"),
        description: t("certifications.ltkia.description"),
      },
      {
        icon: Shield,
        title: t("certifications.iata.title"),
        description: t("certifications.iata.description"),
      },
      {
        icon: Globe,
        title: t("certifications.etoa.title"),
        description: t("certifications.etoa.description"),
      },
    ],
    [t]
  );

  const handleContact = () => router.push("/contact");
  const handleViewTours = () => router.push("/search");

  useGSAP(
    () => {
      gsap.set(".heroAni", { opacity: 0, y: 30 });
      gsap.set(".storyTextAni", { opacity: 0, x: -40 });
      gsap.set(".storyImageAni", { opacity: 0, x: 40, scale: 0.96 });
      gsap.set(".valuesTitleAni", { opacity: 0, y: 24 });
      gsap.set(".valueCardAni", { opacity: 0, y: 28 });
      gsap.set(".achievementsAni", { opacity: 0, y: 28 });
      gsap.set(".certTitleAni", { opacity: 0, y: 24 });
      gsap.set(".certCardAni", { opacity: 0, y: 28 });
      gsap.set(".missionVisionAni", { opacity: 0, y: 28 });
      gsap.set(".ctaAni", { opacity: 0, y: 24 });

      const heroTl = gsap.timeline({ delay: 0.2 });
      heroTl.to(".heroAni", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.to(".storyTextAni", {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".storySection",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      gsap.to(".storyImageAni", {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".storySection",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      const valuesTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".valuesSection",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      valuesTl
        .to(".valuesTitleAni", {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .to(
          ".valueCardAni",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.3"
        );

      gsap.to(".achievementsAni", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".achievementsSection",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      const certTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".certificationsSection",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      certTl
        .to(".certTitleAni", {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .to(
          ".certCardAni",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.14,
            ease: "power3.out",
          },
          "-=0.25"
        );

      gsap.to(".missionVisionAni", {
        opacity: 1,
        y: 0,
        duration: 0.75,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".missionVisionSection",
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      gsap.to(".ctaAni", {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".ctaSection",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    },
    { scope: container }
  );

  return (
    <main ref={container} className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <section className="text-center mb-16">
          <h1 className="heroAni text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {t("hero.title.firstPart")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
              {t("hero.title.secondPart")}
            </span>
          </h1>

          <p className="heroAni text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </section>

        <section className="storySection grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="storyTextAni">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {t("story.title")}
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>{t("story.paragraph1")}</p>
              <p>{t("story.paragraph2")}</p>
              <p>{t("story.paragraph3")}</p>
            </div>
          </div>

          <div className="storyImageAni relative">
            <div className="relative h-[320px] md:h-[420px] w-full overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Kelionių agentūra"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -right-2 md:-right-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white p-5 md:p-6 rounded-2xl shadow-xl">
              <div className="text-3xl font-bold">7+</div>
              <div className="text-sm">
                {t("achievements.yearsExperience.label")}
              </div>
            </div>
          </div>
        </section>

        <section className="valuesSection mb-20">
          <h2 className="valuesTitleAni text-3xl font-bold text-gray-800 text-center mb-12">
            {t("values.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;

              return (
                <div key={index} className={`valueCardAni ${cardClass}`}>
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-white" size={32} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {value.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="achievementsSection achievementsAni bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-8 md:p-12 text-white mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t("achievements.title")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-yellow-300">
                  {achievement.number}
                </div>
                <div className="text-lg font-semibold opacity-90 mb-1">
                  {achievement.label}
                </div>
                <div className="text-sm opacity-75">
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="certificationsSection mb-20">
          <h2 className="certTitleAni text-3xl font-bold text-gray-800 text-center mb-12">
            {t("certifications.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications.map((item, index) => {
              const IconComponent = item.icon;

              return (
                <div key={index} className={`certCardAni ${cardClass}`}>
                  <IconComponent className="text-teal-600 mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="missionVisionSection grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="missionVisionAni bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t("missionVision.mission.title")}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t("missionVision.mission.description")}
            </p>
          </div>

          <div className="missionVisionAni bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {t("missionVision.vision.title")}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t("missionVision.vision.description")}
            </p>
          </div>
        </section>

        <section className="ctaSection ctaAni text-center mt-16">
          <p className="text-lg text-gray-600 mb-6">
            {t("callToAction.title")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleContact} className={actionButtonPrimaryClass}>
              {t("callToAction.contactButton")}
            </button>

            <button onClick={handleViewTours} className={actionButtonSecondaryClass}>
              {t("callToAction.viewToursButton")}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}