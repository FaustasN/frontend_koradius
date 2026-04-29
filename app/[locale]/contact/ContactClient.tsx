"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  User,
  CheckCircle,
  X
} from "lucide-react";
import { submitContactInquiry } from "@/app/services/emailService";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredContact: string;
  urgency: string;
};

const INITIAL_FORM: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  preferredContact: "email",
  urgency: "normal"
};

export default function ContactClient() {
  const t = useTranslations("contact");
  const container = useRef<HTMLDivElement>(null);
  const successNotificationRef = useRef<HTMLDivElement>(null);
const errorNotificationRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ContactFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const preferredContactOptions = useMemo(
    () => [
      { value: "email", label: t("form.preferredContact.email") },
      { value: "phone", label: t("form.preferredContact.phone") },
      { value: "both", label: t("form.preferredContact.both") }
    ],
    [t]
  );

  const urgencyOptions = useMemo(
    () => [
      { value: "normal", label: t("form.urgency.normal") },
      { value: "urgent", label: t("form.urgency.urgent") },
      { value: "emergency", label: t("form.urgency.emergency") }
    ],
    [t]
  );

  const contactInfo = useMemo(
    () => [
      {
        icon: MapPin,
        title: t("contactInfo.address.title"),
        details: ["Švitrigailos g. 11A-330", "LT-03228 Vilnius", "Lietuva"],
        color: "text-red-500"
      },
      {
        icon: Phone,
        title: t("contactInfo.phone.title"),
        details: ["+370 694 98078"],
        color: "text-green-500"
      },
      {
        icon: Mail,
        title: t("contactInfo.email.title"),
        details: ["jdfcompetition@gmail.com"],
        color: "text-blue-500"
      },
      {
        icon: Clock,
        title: t("contactInfo.workingHours.title"),
        details: [
          t("contactInfo.workingHours.details.0"),
          t("contactInfo.workingHours.details.1"),
          t("contactInfo.workingHours.details.2")
        ],
        color: "text-purple-500"
      }
    ],
    [t]
  );

  const subjects = useMemo(
    () => [
      t("form.subjects.0"),
      t("form.subjects.1"),
      t("form.subjects.2"),
      t("form.subjects.3"),
      t("form.subjects.4"),
      t("form.subjects.5"),
      t("form.subjects.6"),
      t("form.subjects.7")
    ],
    [t]
  );

  const officeHours = useMemo(
    () => [
      {
        day: t("contactInfo.officeHours.days.monday"),
        hours: t("contactInfo.officeHours.hours.open"),
        status: "open"
      },
      {
        day: t("contactInfo.officeHours.days.tuesday"),
        hours: t("contactInfo.officeHours.hours.open"),
        status: "open"
      },
      {
        day: t("contactInfo.officeHours.days.wednesday"),
        hours: t("contactInfo.officeHours.hours.open"),
        status: "open"
      },
      {
        day: t("contactInfo.officeHours.days.thursday"),
        hours: t("contactInfo.officeHours.hours.open"),
        status: "open"
      },
      {
        day: t("contactInfo.officeHours.days.friday"),
        hours: t("contactInfo.officeHours.hours.open"),
        status: "open"
      },
      {
        day: t("contactInfo.officeHours.days.saturday"),
        hours: t("contactInfo.officeHours.hours.limited"),
        status: "limited"
      },
      {
        day: t("contactInfo.officeHours.days.sunday"),
        hours: t("contactInfo.officeHours.hours.closed"),
        status: "closed"
      }
    ],
    [t]
  );

  const faqLeft = useMemo(
    () => [
      {
        question: t("contactInfo.faq.questions.responseTime.question"),
        answer: t("contactInfo.faq.questions.responseTime.answer")
      },
      {
        question: t("contactInfo.faq.questions.appointment.question"),
        answer: t("contactInfo.faq.questions.appointment.answer")
      },
      {
        question: t("contactInfo.faq.questions.language.question"),
        answer: t("contactInfo.faq.questions.language.answer")
      }
    ],
    [t]
  );

  const faqRight = useMemo(
    () => [
      {
        question: t("contactInfo.faq.questions.tripChanges.question"),
        answer: t("contactInfo.faq.questions.tripChanges.answer")
      },
      {
        question: t("contactInfo.faq.questions.payment.question"),
        answer: t("contactInfo.faq.questions.payment.answer")
      },
      {
        question: t("contactInfo.faq.questions.insurance.question"),
        answer: t("contactInfo.faq.questions.insurance.answer")
      }
    ],
    [t]
  );

  useGSAP(
    () => {
      gsap.set(".firstAni", { opacity: 0, y: 20 });
      gsap.set(".secondAni", { opacity: 0, y: 24 });
      gsap.set(".thirdAni", { opacity: 0, y: 28 });
      gsap.set(".fourthAni", { opacity: 0 });

      const introTl = gsap.timeline({ delay: 0.2 });

      introTl
        .to(".firstAni", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        })
        .to(
          ".secondAni",
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out"
          },
          "-=0.35"
        );

      gsap.to(".thirdAni", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".mainContentSection",
          start: "top 78%",
          toggleActions: "play none none none"
        }
      });

      gsap.to(".fourthAni", {
        opacity: 1,
        duration: 0.8,
        stagger: 0.14,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".bottomSections",
          start: "top 80%",
          toggleActions: "play none none none"
        }
      });
    },
    { scope: container }
  );

  useEffect(() => {
    if (!showSuccessNotification) return;
    const timer = setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showSuccessNotification]);

  useEffect(() => {
    if (!showErrorNotification) return;
    const timer = setTimeout(() => {
      setShowErrorNotification(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showErrorNotification]);

  const resetForm = () => {
    setFormData(INITIAL_FORM);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const displayErrorNotification = (message: string) => {
    setErrorMessage(message);
    setShowErrorNotification(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject ||
      !formData.message.trim()
    ) {
      displayErrorNotification(t("form.validation.fillAllFields"));
      return;
    }

    if (formData.name.trim().length < 3) {
      displayErrorNotification(t("form.validation.nameMinLength"));
      return;
    }

    if (!formData.email.includes("@") || !formData.email.includes(".")) {
      displayErrorNotification(t("form.validation.emailInvalid"));
      return;
    }

    if (formData.phone && (formData.phone.length < 6 || !/^\d+$/.test(formData.phone))) {
      displayErrorNotification(t("form.validation.phoneInvalid"));
      return;
    }

    if (formData.message.trim().length < 3) {
      displayErrorNotification(t("form.validation.messageMinLength"));
      return;
    }

    if (formData.message.trim().length > 70) {
      displayErrorNotification(t("form.validation.messageMaxLength"));
      return;
    }

    setIsSubmitting(true);

    try {
      await submitContactInquiry(formData);
      resetForm();
      setShowSuccessNotification(true);
    } catch {
      displayErrorNotification(
        "Atsiprašome, įvyko klaida. Bandykite dar kartą arba susisiekite telefonu."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    if (!showSuccessNotification || !successNotificationRef.current) return;
  
    gsap.fromTo(
      successNotificationRef.current,
      { opacity: 0, y: -20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power3.out" }
    );
  }, [showSuccessNotification]);
  
  useEffect(() => {
    if (!showErrorNotification || !errorNotificationRef.current) return;
  
    gsap.fromTo(
      errorNotificationRef.current,
      { opacity: 0, y: -20, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power3.out" }
    );
  }, [showErrorNotification]);

  return (
    <div ref={container} className="min-h-screen bg-gray-50 pt-24">
    {showSuccessNotification && (
  <div className="fixed top-24 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-50 w-[calc(100%-2rem)] max-w-sm">
    <div
      ref={successNotificationRef}
      className="w-full bg-white rounded-2xl shadow-2xl border-l-4 border-green-500 p-6"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {t("form.validation.successMessage")}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t("form.validation.successDescription")}
          </p>
        </div>
        <button
          onClick={() => setShowSuccessNotification(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
        <div className="bg-green-500 h-1 rounded-full animate-progress-bar"></div>
      </div>
    </div>
  </div>
)}

{showErrorNotification && (
  <div className="fixed top-24 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-50 w-[calc(100%-2rem)] max-w-sm">
    <div
      ref={errorNotificationRef}
      className="w-full bg-white rounded-2xl shadow-2xl border-l-4 border-red-500 p-6"
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <X className="text-red-600" size={24} />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {t("form.validation.errorMessage")}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">{errorMessage}</p>
        </div>
        <button
          onClick={() => setShowErrorNotification(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
        <div className="bg-red-500 h-1 rounded-full animate-progress-bar"></div>
      </div>
    </div>
  </div>
)}

      <div className="container mx-auto px-4 py-8">
        <div className="firstAni opacity-0 text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            {t("hero.title.firstPart")}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
              {t("hero.title.secondPart")}
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="secondAni opacity-0 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 btn-hover-smooth">
            <Phone size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t("quickContact.phone.title")}</h3>
            <p className="mb-4 opacity-90">{t("quickContact.phone.description")}</p>
            <a
              href="tel:+37069498078"
              className="bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-block btn-hover-smooth"
            >
              +370 694 98078
            </a>
          </div>

          <div className="secondAni opacity-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 btn-hover-smooth">
            <Mail size={48} className="mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t("quickContact.email.title")}</h3>
            <p className="mb-4 opacity-90">{t("quickContact.email.description")}</p>
            <a
              href="mailto:jdfcompetition@gmail.com"
              className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 inline-block btn-hover-smooth"
            >
              {t("quickContact.email.button")}
            </a>
          </div>
        </div>

        <div className="mainContentSection grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          <div className="thirdAni opacity-0 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">{t("form.title")}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {t("form.name.label")}
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 focus:outline-none transition-all duration-300 text-lg"
                      placeholder={t("form.name.placeholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {t("form.email.label")}
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 focus:outline-none transition-all duration-300 text-lg"
                      placeholder={t("form.email.placeholder")}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {t("form.phone.label")}
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      size={20}
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setFormData((prev) => ({
                          ...prev,
                          phone: value
                        }));
                      }}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 focus:outline-none transition-all duration-300 text-lg"
                      placeholder={t("form.phone.placeholder")}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {t("form.subject.label")}
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-teal-500 focus:outline-none transition-all duration-300 text-lg appearance-none"
                  >
                    <option value="">{t("form.subject.placeholder")}</option>
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {t("form.preferredContact.label")}
                  </label>
                  <select
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-teal-500 focus:outline-none transition-all duration-300 text-lg appearance-none"
                  >
                    {preferredContactOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    {t("form.urgency.label")}
                  </label>
                  <select
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 focus:border-teal-500 focus:outline-none transition-all duration-300 text-lg appearance-none"
                  >
                    {urgencyOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  {t("form.message.label")}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:border-teal-500 focus:outline-none transition-all duration-300 text-lg resize-none"
                  placeholder={t("form.message.placeholder")}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-600">{t("form.message.minLength")}</p>
                  <p
                    className={`text-sm font-medium ${
                      formData.message.length >= 3 && formData.message.length <= 70
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {formData.message.length}/70
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center space-x-3 btn-hover-smooth ${
                  isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>{t("form.submit.sending")}</span>
                  </>
                ) : (
                  <>
                    <Send size={24} />
                    <span>{t("form.submit.button")}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="thirdAni opacity-0 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">{t("contactInfo.title")}</h2>

              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`${info.color} p-2 rounded-full flex-shrink-0`}>
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 mb-1">{info.title}</h3>
                        {info.details.map((detail, detailIndex) => (
                          <p
                            key={detailIndex}
                            className="text-gray-600 text-sm leading-relaxed"
                          >
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {t("contactInfo.workingHours.title")}
              </h3>
              <div className="space-y-2">
                {officeHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-medium text-gray-700 text-sm">{schedule.day}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 text-sm">{schedule.hours}</span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          schedule.status === "open"
                            ? "bg-green-500"
                            : schedule.status === "limited"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bottomSections">
          <div className="fourthAni  mb-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {t("contactInfo.location.title")}
                </h2>
                <p className="text-gray-600">{t("contactInfo.location.description")}</p>
              </div>
              <div className="h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2304.6765974!2d25.2675214!3d54.6765974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dd946d87d7005d%3A0x11b4d455af676ea0!2s%C5%A0vitrigailos%20g.%2011A%2C%20Vilnius%2003228!5e0!3m2!1slt!2slt!4v1234567890123"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kelionių kampas - Švitrigailos g. 11A-330, Vilnius"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>

          <div className=" bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              {t("contactInfo.faq.title1")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
                {t("contactInfo.faq.title2")}
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {faqLeft.map((item, index) => (
                  <div key={index} className="border-l-4 border-teal-500 pl-4">
                    <h3 className="font-bold text-gray-800 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                {faqRight.map((item, index) => (
                  <div key={index} className="border-l-4 border-teal-500 pl-4">
                    <h3 className="font-bold text-gray-800 mb-2">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}