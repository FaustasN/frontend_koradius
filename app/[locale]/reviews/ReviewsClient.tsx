"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  Quote,
  Calendar,
  ThumbsUp,
  X,
  Send,
  CheckCircle
} from "lucide-react";
import { reviewsAPI, type Review } from "@/app/services/adminApiService";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type ReviewFormState = {
  name: string;
  email: string;
  description: string;
  rating: number;
  category: string;
  tripReference: string;
};

const INITIAL_REVIEW_FORM: ReviewFormState = {
  name: "",
  email: "",
  description: "",
  rating: 0,
  category: "vacation",
  tripReference: ""
};

export default function ReviewsPage() {
  const t = useTranslations("reviews");

  const container = useRef<HTMLDivElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const [currentReview, setCurrentReview] = useState(0);
  const [filterRating, setFilterRating] = useState("all");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reviewForm, setReviewForm] = useState<ReviewFormState>(INITIAL_REVIEW_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const successNotificationRef = useRef<HTMLDivElement>(null);
const errorNotificationRef = useRef<HTMLDivElement>(null);

  const categoryOptions = useMemo(
    () => [
      { value: "vacation", label: t("form.options.vacation") },
      { value: "weekend", label: t("form.options.weekend") },
      { value: "medical", label: t("form.options.medical") },
      { value: "nature", label: t("form.options.nature") }
    ],
    [t]
  );

  const ratings = useMemo(
    () => [
      { id: "all", label: t("ratings.all") },
      { id: "5", label: t("ratings.fiveStars") },
      { id: "4", label: t("ratings.fourStars") },
      { id: "3", label: t("ratings.threeStars") }
    ],
    [t]
  );

  const filteredReviews = useMemo(() => {
    return reviews.filter(
      (review) => filterRating === "all" || review.rating.toString() === filterRating
    );
  }, [reviews, filterRating]);

  const averageRating = useMemo(() => {
    return reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  }, [reviews]);

  const totalReviews = reviews.length;

  const loadApprovedReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsAPI.getApproved();
      setReviews(data);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const resetReviewForm = () => {
    setReviewForm(INITIAL_REVIEW_FORM);
  };

  const openReviewForm = () => {
    setShowReviewForm(true);
  };

  const closeReviewForm = () => {
    setShowReviewForm(false);
    resetReviewForm();
  };

  const displayErrorNotification = (message: string) => {
    setErrorMessage(message);
    setShowErrorNotification(true);

    setTimeout(() => {
      setShowErrorNotification(false);
    }, 5000);
  };

  const handleRatingChange = (rating: number) => {
    setReviewForm((prev) => ({ ...prev, rating }));
  };

  const nextReview = () => {
    if (filteredReviews.length === 0) return;
    setCurrentReview((prev) => (prev + 1) % filteredReviews.length);
  };

  const prevReview = () => {
    if (filteredReviews.length === 0) return;
    setCurrentReview((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={20}
        className={`${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  const renderRatingStars = (
    rating: number,
    interactive: boolean = false,
    onRatingChange?: (rating: number) => void
  ) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={interactive ? 32 : 20}
        className={`${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:scale-110 transition-transform duration-200" : ""}`}
        onClick={() => interactive && onRatingChange && onRatingChange(index + 1)}
      />
    ));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !reviewForm.name.trim() ||
      !reviewForm.email.trim() ||
      !reviewForm.description.trim() ||
      reviewForm.rating === 0
    ) {
      displayErrorNotification(t("form.validation.fillAllFields"));
      return;
    }

    if (reviewForm.name.trim().length < 3) {
      displayErrorNotification(t("form.validation.nameMinLength"));
      return;
    }

    if (!reviewForm.email.includes("@") || !reviewForm.email.includes(".")) {
      displayErrorNotification(t("form.validation.emailInvalid"));
      return;
    }

    if (reviewForm.description.trim().length < 15) {
      displayErrorNotification(t("form.validation.descriptionMinLength"));
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewsAPI.submit({
        name: reviewForm.name,
        email: reviewForm.email,
        rating: reviewForm.rating,
        comment: reviewForm.description,
        tripReference: reviewForm.tripReference || undefined
      });

      resetReviewForm();
      setShowReviewForm(false);
      setShowSuccessNotification(true);

      setTimeout(() => {
        setShowSuccessNotification(false);
      }, 5000);

      await loadApprovedReviews();
    } catch {
      displayErrorNotification(t("notifications.errorDescription"));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    loadApprovedReviews();
  }, []);

  useEffect(() => {
    if (currentReview >= filteredReviews.length && filteredReviews.length > 0) {
      setCurrentReview(0);
    }
  }, [filteredReviews, currentReview]);

  useEffect(() => {
    document.body.style.overflow = showReviewForm ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showReviewForm]);

  useGSAP(
    () => {
      if (loading) return;

      const tl = gsap.timeline({ delay: 0.3 });

      gsap.set(".firstAni", { opacity: 0, y: 20 });
      gsap.set(".secondAni", { opacity: 0, y: 20 });
      gsap.set(".thirdAni", { opacity: 0 });

      tl.to(".firstAni", {
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
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out"
          },
          "-=0.4"
        )
        .to(
          ".thirdAni",
          {
            opacity: 1,
            stagger: 0.08,
            duration: 0.6,
            ease: "power2.out"
          },
          "-=0.2"
        );
    },
    {
      scope: container,
      dependencies: [loading, filterRating, reviews.length]
    }
  );

  useEffect(() => {
    if (!showReviewForm) return;
    if (!modalOverlayRef.current || !modalContentRef.current) return;

    gsap.fromTo(
      modalOverlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.22, ease: "power2.out" }
    );

    gsap.fromTo(
      modalContentRef.current,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power3.out" }
    );
  }, [showReviewForm]);

  useEffect(() => {
    if (!showSuccessNotification || !successNotificationRef.current) return;
  
    gsap.fromTo(
      successNotificationRef.current,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power3.out" }
    );
  }, [showSuccessNotification]);
  
  useEffect(() => {
    if (!showErrorNotification || !errorNotificationRef.current) return;
  
    gsap.fromTo(
      errorNotificationRef.current,
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power3.out" }
    );
  }, [showErrorNotification]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={container} className="min-h-screen bg-gray-50 pt-24">
      {showSuccessNotification && (
        <div className="fixed top-24 right-4 z-[80] pointer-events-none">
          <div  ref={successNotificationRef} className="bg-white rounded-2xl shadow-2xl border-l-4 border-green-500 p-6 max-w-sm transform transition-all duration-500 ease-out pointer-events-auto">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {t("notifications.success")}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t("notifications.successDescription")}
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
        <div className="fixed top-24 right-4 z-[80]  pointer-events-none">
          <div   ref={errorNotificationRef} className="bg-white rounded-2xl shadow-2xl border-l-4 border-red-500 p-6 max-w-sm transform transition-all duration-500 ease-out pointer-events-auto">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="text-red-600" size={24} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {t("notifications.error")}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {errorMessage}
                </p>
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
        <div className="firstAni text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              {t("title.firstPart")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
                {t("title.secondPart")}
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {showReviewForm && (
          <div
            ref={modalOverlayRef}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <div
              ref={modalContentRef}
             className="modal-scroll bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto overscroll-contain"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-3 rounded-full">
                    <Quote className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{t("modalTitle")}</h2>
                </div>
                <button
                  onClick={closeReviewForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        {t("form.name")}
                      </label>
                      <input
                        type="text"
                        value={reviewForm.name}
                        onChange={(e) =>
                          setReviewForm((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder={t("form.placeholders.name")}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        {t("form.email")}
                      </label>
                      <input
                        type="email"
                        value={reviewForm.email}
                        onChange={(e) =>
                          setReviewForm((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder={t("form.placeholders.email")}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        {t("form.tripType")}
                      </label>
                      <select
                        value={reviewForm.category}
                        onChange={(e) =>
                          setReviewForm((prev) => ({ ...prev, category: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        required
                      >
                        {categoryOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-2">
                        {t("form.tripNumber")}
                      </label>
                      <input
                        type="text"
                        value={reviewForm.tripReference}
                        onChange={(e) =>
                          setReviewForm((prev) => ({
                            ...prev,
                            tripReference: e.target.value
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                        placeholder="Pvz.: KT2024-001"
                      />
                      <p className="text-sm text-gray-600 mt-1">
                        {t("form.helpers.tripNumber")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("form.rating")}
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-1">
                        {renderRatingStars(reviewForm.rating, true, handleRatingChange)}
                      </div>
                      <span className="text-lg font-semibold text-gray-700">
                        {reviewForm.rating > 0
                          ? `${reviewForm.rating}/5`
                          : t("form.selectRating")}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      {t("form.review")}
                    </label>
                    <textarea
                      value={reviewForm.description}
                      onChange={(e) =>
                        setReviewForm((prev) => ({
                          ...prev,
                          description: e.target.value
                        }))
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder={t("form.placeholders.review")}
                      required
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-600">
                        {t("form.validation.minLength")}
                      </p>
                      <p
                        className={`text-xs font-medium ${
                          reviewForm.description.length >= 15
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {reviewForm.description.length}/15
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <Calendar size={14} />
                      <span className="text-sm">
                        {t("form.autoDate")} {new Date().toLocaleDateString("lt-LT")}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={closeReviewForm}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                    >
                      {t("form.buttons.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center space-x-2"
                    >
                      <Send size={18} />
                      <span>
                        {isSubmitting
                          ? t("form.buttons.submitting")
                          : t("form.buttons.submit")}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="secondAni bg-white rounded-3xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-teal-600 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-gray-600">{t("stats.averageRating")}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-teal-600 mb-2">{totalReviews}</div>
              <div className="text-gray-600">{t("stats.totalReviews")}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-teal-600 mb-2">98%</div>
              <div className="text-gray-600">{t("stats.recommendFriends")}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-teal-600 mb-2">85%</div>
              <div className="text-gray-600">{t("stats.returnCustomers")}</div>
            </div>
          </div>
        </div>

        <div className="secondAni bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              {t("filters.rating")}
            </label>
            <div className="flex flex-wrap gap-2">
              {ratings.map((rating) => (
                <button
                  key={rating.id}
                  onClick={() => setFilterRating(rating.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    filterRating === rating.id
                      ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white"
                      : "bg-gray-100 text-gray-800 hover:bg-teal-50 hover:text-teal-600"
                  }`}
                >
                  {rating.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredReviews.length > 0 && (
          <div className="thirdAni mb-16">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
              {t("featuredReviews")}
            </h2>

            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-100 to-yellow-200 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-full">
                      <Quote className="text-white" size={32} />
                    </div>
                  </div>

                  <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed text-center mb-8 italic">
                    {filteredReviews[currentReview]?.comment}
                  </blockquote>

                  <div className="flex justify-center mb-6">
                    <div className="flex space-x-1">
                      {renderStars(filteredReviews[currentReview]?.rating || 5)}
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-600 font-bold text-xl">
                      {filteredReviews[currentReview]?.name?.charAt(0)}
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-gray-800 text-lg">
                        {filteredReviews[currentReview]?.name}
                      </h4>
                      <p className="text-gray-700">{filteredReviews[currentReview]?.email}</p>
                      {filteredReviews[currentReview]?.trip_reference && (
                        <p className="text-sm text-teal-600 font-semibold mt-1">
                          {filteredReviews[currentReview]?.trip_reference}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(
                          filteredReviews[currentReview]?.created_at || ""
                        ).toLocaleDateString("lt-LT")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {filteredReviews.length > 1 && (
                <>
                  <button
                    onClick={prevReview}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-teal-50 text-teal-600 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-20"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={nextReview}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-teal-50 text-teal-600 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-20"
                  >
                    <ChevronRight size={24} />
                  </button>

                  <div className="flex justify-center space-x-2 mt-8">
                    {filteredReviews.map((review, index) => (
                      <button
                        key={`dot-${review.id}-${index}`}
                        onClick={() => setCurrentReview(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentReview
                            ? "bg-teal-500 w-8"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="thirdAni mb-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            {t("allReviews")} ({filteredReviews.length})
          </h2>

          {filteredReviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Quote className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {t("noReviews.title")}
              </h3>
              <p className="text-gray-500">
                {filterRating !== "all"
                  ? t("noReviews.noRatingFilter")
                  : t("noReviews.noApprovedReviews")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="thirdAni bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-600 font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{review.name}</h4>
                      <div className="text-sm text-gray-700">{review.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex space-x-1">{renderStars(review.rating)}</div>
                    <span className="text-sm text-gray-700">{review.rating}/5</span>
                  </div>

                  {review.trip_reference && (
                    <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                      {review.trip_reference}
                    </div>
                  )}

                  <p className="text-gray-800 leading-relaxed mb-4 line-clamp-4">
                    {review.comment}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{new Date(review.created_at).toLocaleDateString("lt-LT")}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="thirdAni bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-12 text-white text-center">
          <Quote size={64} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">{t("shareExperience.title")}</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {t("shareExperience.subtitle")}
          </p>
          <button
            onClick={openReviewForm}
            className="bg-white hover:bg-gray-100 text-teal-600 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg btn-hover-smooth"
          >
            {t("shareExperience.button")}
          </button>
        </div>

        <div className="thirdAni mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {t("trustIndicators.verifiedReviews.title")}
            </h3>
            <p className="text-gray-700">{t("trustIndicators.verifiedReviews.description")}</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Quote className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {t("trustIndicators.realCustomers.title")}
            </h3>
            <p className="text-gray-700">{t("trustIndicators.realCustomers.description")}</p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ThumbsUp className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {t("trustIndicators.highRating.title")}
            </h3>
            <p className="text-gray-700">{t("trustIndicators.highRating.description")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}