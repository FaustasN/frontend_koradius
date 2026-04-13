"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Star,
  ArrowRight,
  AlertCircle,
  X,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { travelPacketsApi, transformTravelPacket } from "../../services/apiService";
import CustomDatePicker from "../globalComponents/CustomDatePicker";

type TravelPacket = {
  id: number;
  title: string;
  location: string;
  duration: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  badge: string;
  description: string;
  includes: string[];
  availableSpots: number;
  departure: string;
};

type BookingFormState = {
  name: string;
  phone: string;
  email: string;
  departureDate: string;
  numberOfPeople: number;
};

const INITIAL_BOOKING_FORM: BookingFormState = {
  name: "",
  phone: "",
  email: "",
  departureDate: "",
  numberOfPeople: 1,
};

const FeaturedToursWithPayment = () => {
  const t = useTranslations("featuredTours");

  const [tours, setTours] = useState<TravelPacket[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showTourDetails, setShowTourDetails] = useState(false);

  const [selectedTour, setSelectedTour] = useState<TravelPacket | null>(null);
  const [tourDetails, setTourDetails] = useState<TravelPacket | null>(null);

  const [bookingForm, setBookingForm] = useState<BookingFormState>(INITIAL_BOOKING_FORM);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [departureDateError, setDepartureDateError] = useState("");
  const [durationError, setDurationError] = useState("");
  const [formError, setFormError] = useState("");

  const toursPerPage = 3;

  const detailsOverlayRef = useRef<HTMLDivElement>(null);
  const detailsContentRef = useRef<HTMLDivElement>(null);
  const bookingOverlayRef = useRef<HTMLDivElement>(null);
  const bookingContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFeaturedTours = async () => {
      try {
        setLoading(true);
        const packets = await travelPacketsApi.getAll();
        const transformedTours: TravelPacket[] = packets.map(transformTravelPacket);
        setTours(transformedTours);
      } catch {
        setTours([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedTours();
  }, []);

  useEffect(() => {
    const hasOpenModal = showBookingForm || showTourDetails;
    document.body.style.overflow = hasOpenModal ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showBookingForm, showTourDetails]);

  useEffect(() => {
    if (!showTourDetails) return;
    if (!detailsOverlayRef.current || !detailsContentRef.current) return;

    gsap.fromTo(
      detailsOverlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.22, ease: "power2.out" }
    );

    gsap.fromTo(
      detailsContentRef.current,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power3.out" }
    );
  }, [showTourDetails]);

  useEffect(() => {
    if (!showBookingForm) return;
    if (!bookingOverlayRef.current || !bookingContentRef.current) return;

    gsap.fromTo(
      bookingOverlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.22, ease: "power2.out" }
    );

    gsap.fromTo(
      bookingContentRef.current,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power3.out" }
    );
  }, [showBookingForm]);

  const totalPages = useMemo(() => Math.ceil(tours.length / toursPerPage), [tours.length]);

  const currentTours = useMemo(() => {
    const startIndex = currentPage * toursPerPage;
    return tours.slice(startIndex, startIndex + toursPerPage);
  }, [currentPage, tours]);

  const resetErrors = () => {
    setPhoneError("");
    setNameError("");
    setEmailError("");
    setDepartureDateError("");
    setDurationError("");
    setFormError("");
  };

  const resetBookingState = () => {
    setBookingForm(INITIAL_BOOKING_FORM);
    setBookingConfirmed(false);
    resetErrors();
  };

  const openBookingForm = (tour: TravelPacket) => {
    setSelectedTour(tour);
    resetBookingState();
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    setShowBookingForm(false);
    setSelectedTour(null);
    resetBookingState();
  };

  const openTourDetails = (tour: TravelPacket) => {
    setTourDetails(tour);
    setShowTourDetails(true);
  };

  const closeTourDetails = () => {
    setShowTourDetails(false);
    setTourDetails(null);
  };

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1 >= totalPages ? 0 : prev + 1));
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 < 0 ? totalPages - 1 : prev - 1));
  };

  const validateName = (name: string): boolean => {
    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
      setNameError(t("bookingForm.validation.nameMinLength"));
      return false;
    }

    const nameRegex = /^[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ\s]+$/;
    if (!nameRegex.test(trimmedName)) {
      setNameError(t("bookingForm.validation.nameOnlyLetters"));
      return false;
    }

    setNameError("");
    return true;
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setEmailError(t("bookingForm.validation.emailRequired"));
      return false;
    }

    if (!emailRegex.test(email.trim())) {
      setEmailError(t("bookingForm.validation.emailInvalid"));
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePhone = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, "");

    if (digitsOnly.length < 6) {
      setPhoneError(t("bookingForm.validation.phoneMinLength"));
      return false;
    }

    setPhoneError("");
    return true;
  };

  const validateDates = (): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const departure = new Date(bookingForm.departureDate);

    setDepartureDateError("");
    setDurationError("");

    if (departure <= today) {
      setDepartureDateError(t("bookingForm.validation.departureDateInvalid"));
      return false;
    }

    return true;
  };

  const calculateTotalPrice = () => {
    if (!selectedTour) return 0;
    return (Number(selectedTour.price) || 0) * bookingForm.numberOfPeople;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBookingForm((prev) => ({ ...prev, name: value }));
    if (nameError) setNameError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBookingForm((prev) => ({ ...prev, email: value }));
    if (emailError) setEmailError("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d\s+\-()]/g, "");
    setBookingForm((prev) => ({ ...prev, phone: value }));
    if (phoneError) setPhoneError("");
  };

  const handleDepartureDateChange = (value: string) => {
    setBookingForm((prev) => ({ ...prev, departureDate: value }));
    if (departureDateError) setDepartureDateError("");
    if (durationError) setDurationError("");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !bookingForm.name.trim() ||
      !bookingForm.phone.trim() ||
      !bookingForm.email.trim() ||
      !bookingForm.departureDate ||
      bookingForm.numberOfPeople < 1
    ) {
      setFormError(t("bookingForm.validation.fillAllFields"));
      return;
    }

    const isNameValid = validateName(bookingForm.name);
    const isPhoneValid = validatePhone(bookingForm.phone);
    const isEmailValid = validateEmail(bookingForm.email);
    const isDateValid = validateDates();

    if (!isNameValid || !isPhoneValid || !isEmailValid || !isDateValid) {
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      setBookingConfirmed(true);
    } catch {
      alert(t("bookingForm.validation.generalError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBadgeColor = (badge?: string) => {
    switch (badge) {
      case "Top":
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
      case "New":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white";
      case "Sale":
        return "bg-gradient-to-r from-red-400 to-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t("title")}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t("subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="relative h-48 bg-gray-200 flex-shrink-0">
                  {tour.image && (
                    <Image
                      src={tour.image}
                      alt={tour.title}
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {tour.badge && (
                    <div
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(
                        tour.badge
                      )}`}
                    >
                      {tour.badge}
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{tour.title}</h3>

                  <div className="mb-4 min-h-[3rem]">
                    <p className="text-gray-600 line-clamp-2">{tour.description}</p>
                  </div>

                  <div className="space-y-2 mb-4 flex-shrink-0">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {tour.duration} {t("days")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-auto flex-shrink-0">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-green-600">€{tour.price}</span>
                        {tour.originalPrice ? (
                          <span className="text-sm text-gray-400 line-through">
                            €{tour.originalPrice}
                          </span>
                        ) : null}
                      </div>
                      <span className="text-gray-500 text-xs">/ {t("person")}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:flex-row">
                      <button
                        onClick={() => openTourDetails(tour)}
                        className="min-w-0 px-2.5 py-2 bg-white text-teal-600 border-2 border-teal-600 rounded-full font-bold hover:bg-teal-50 transition-colors flex items-center justify-center text-xs sm:text-sm text-center leading-tight whitespace-normal"
                      >
                        {t("moreInfo")}
                      </button>

                      <button
                        onClick={() => openBookingForm(tour)}
                        className="min-w-0 px-2.5 py-2 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-colors flex items-center justify-center text-xs sm:text-sm text-center leading-tight whitespace-normal"
                      >
                        <CreditCard className="mr-1 h-4 w-4 flex-shrink-0 hidden sm:block" />
                        <span className="break-words">{t("bookNow")}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tours.length > toursPerPage && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={prevPage}
                className="p-3 bg-white text-teal-600 border-2 border-teal-600 rounded-full hover:bg-teal-50 transition-colors"
                aria-label={t("common.previous")}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentPage
                        ? "bg-teal-600"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`${t("common.page")} ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextPage}
                className="p-3 bg-white text-teal-600 border-2 border-teal-600 rounded-full hover:bg-teal-50 transition-colors"
                aria-label={t("common.next")}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/search"
              className="inline-flex items-center px-8 py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-colors"
            >
              {t("viewAllTours")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {showTourDetails && tourDetails && (
        <div
          ref={detailsOverlayRef}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            ref={detailsContentRef}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{tourDetails.title}</h3>
                  <p className="text-gray-500 text-sm mt-1">{t("viewFullDescription")}</p>
                </div>

                <button
                  onClick={closeTourDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="relative h-64 bg-gray-200 rounded-lg mb-6">
                {tourDetails.image && (
                  <Image
                    src={tourDetails.image}
                    alt={tourDetails.title}
                    width={1000}
                    height={1000}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}

                {tourDetails.badge && (
                  <div
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(
                      tourDetails.badge
                    )}`}
                  >
                    {tourDetails.badge}
                  </div>
                )}
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-800">{t("description")}</h4>

                  <div className="inline-flex items-center text-sm text-gray-600">
                    <Clock className="h-5 w-5 mr-2 text-blue-500" />
                    <span className="font-medium">{t("duration")}</span>
                    <span className="ml-2">
                      {tourDetails.duration} {t("days")}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words text-justify">
                    {tourDetails.description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    {(tourDetails.includes ?? []).map((item, index) => (
                      <div key={index} className="flex items-center text-gray-600 mb-2">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">
                        €{tourDetails.price} / {t("person")}
                      </div>

                      {tourDetails.originalPrice ? (
                        <div className="text-xs text-green-600 line-through mt-1">
                          €{tourDetails.originalPrice}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    closeTourDetails();
                    openBookingForm(tourDetails);
                  }}
                  className="px-6 py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-colors flex items-center"
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  {t("bookNowButton")}
                </button>

                <button
                  onClick={closeTourDetails}
                  className="px-6 py-3 bg-white text-teal-600 border-2 border-teal-600 rounded-full font-bold hover:bg-teal-50 transition-colors"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBookingForm && (
        <div
          ref={bookingOverlayRef}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div
            ref={bookingContentRef}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">{t("bookingForm.title")}</h3>
                <button
                  onClick={closeBookingForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {!bookingConfirmed ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {formError && (
                    <div className="flex items-start p-3 bg-red-50 border border-red-200 rounded-md">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                      <p className="text-sm text-red-700">{formError}</p>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("bookingForm.fullName")}
                      </label>
                      <input
                        type="text"
                        value={bookingForm.name}
                        onChange={handleNameChange}
                        placeholder="Jonas Jonaitis"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          nameError ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      {nameError && <p className="mt-1 text-sm text-red-600">{nameError}</p>}
                      <p className="mt-1 text-xs text-gray-500">{t("bookingForm.minLetters")}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("bookingForm.phoneNumber")}
                      </label>
                      <input
                        type="tel"
                        value={bookingForm.phone}
                        onChange={handlePhoneChange}
                        placeholder="+370 6XX XXXXX"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          phoneError ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      {phoneError && <p className="mt-1 text-sm text-red-600">{phoneError}</p>}
                      <p className="mt-1 text-xs text-gray-500">{t("bookingForm.minDigits")}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("bookingForm.emailAddress")}
                    </label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={handleEmailChange}
                      placeholder="jonas@example.com"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
                    <p className="mt-1 text-xs text-gray-500">{t("bookingForm.validEmail")}</p>
                  </div>

                  <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("bookingForm.departureDate")}
                    </label>
                    <CustomDatePicker
                      value={bookingForm.departureDate}
                      onChange={handleDepartureDateChange}
                      minDate={new Date().toISOString().split("T")[0]}
                      placeholder={t("common.selectDate")}
                      error={departureDateError}
                    />
                  </div>

                  {durationError && (
                    <div className="col-span-2">
                      <p className="mt-1 text-sm text-red-600">{durationError}</p>
                    </div>
                  )}

                  {selectedTour?.duration && (
                    <div>
                      <p className="mt-1 text-xs text-gray-500">
                        {t("tourDuration")} {selectedTour.duration} {t("days")}{" "}
                        {t("accordingToPackage")}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("bookingForm.numberOfPeople")}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={bookingForm.numberOfPeople}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (!Number.isNaN(value) && value >= 1) {
                          setBookingForm((prev) => ({ ...prev, numberOfPeople: value }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">{t("bookingForm.minPeople")}</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting
                      ? t("bookingForm.submitting")
                      : t("bookingForm.submitButton")}
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        <CheckIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">
                          {t("paymentSection.bookingConfirmed")}
                        </h4>
                        <p className="text-green-700 text-sm">
                          {t("paymentSection.nowCanPay")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      {t("paymentSection.orderInfo")}
                    </h4>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("paymentSection.tour")}</span>
                        <span className="font-medium">{selectedTour?.title}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {t("paymentSection.numberOfPeople")}
                        </span>
                        <span className="font-medium">{bookingForm.numberOfPeople}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">{t("paymentSection.totalAmount")}</span>
                        <span className="font-bold text-lg text-green-600">
                          €{calculateTotalPrice().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default FeaturedToursWithPayment;