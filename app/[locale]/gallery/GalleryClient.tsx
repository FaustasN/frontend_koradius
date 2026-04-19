"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, ChevronLeft, ChevronRight, MapPin, Camera, Heart } from "lucide-react";
import { galleryApi, transformGalleryItem } from "@/app/services/apiService";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type GalleryImage = {
  id: number;
  src: string;
  title: string;
  location: string;
  photographer: string;
  date: string;
  likes: number;
  category: string;
};
let galleryCache: GalleryImage[] | null = null;
let galleryCachePromise: Promise<GalleryImage[]> | null = null;

export default function GalleryClient() {
  const t = useTranslations("gallery");

  const container = useRef<HTMLDivElement>(null);
  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const hasAnimatedRef = useRef(false);
  const pulseTl = useRef<GSAPTimeline | null>(null);

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [likedImages, setLikedImages] = useState<Set<number>>(() => {
    if (typeof window === "undefined") return new Set();

    try {
      const savedLikes = localStorage.getItem("galleryLikes");
      if (!savedLikes) return new Set();

      const likedIds = JSON.parse(savedLikes) as number[];
      return new Set(likedIds);
    } catch {
      return new Set();
    }
  });

  const [likeLoading, setLikeLoading] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
  
    const loadImages = async () => {
      try {
        setError(null);
  
        if (galleryCache && galleryCache.length > 0) {
          setImages(galleryCache);
          setLoading(false);
          return;
        }
  
        setLoading(true);
  
        if (!galleryCachePromise) {
          galleryCachePromise = galleryApi
            .getAll()
            .then((galleryItems) => {
              const transformed = galleryItems.map(transformGalleryItem) as GalleryImage[];
              galleryCache = transformed;
              return transformed;
            })
            .finally(() => {
              galleryCachePromise = null;
            });
        }
  
        const data = await galleryCachePromise;
  
        if (!isMounted) return;
  
        setImages(data);
      } catch {
        if (!isMounted) return;
        setError("Failed to load gallery images. Please try again later.");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };
  
    loadImages();
  
    return () => {
      isMounted = false;
    };
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("galleryLikes", JSON.stringify(Array.from(likedImages)));
  }, [likedImages]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      pulseTl.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (selectedImage === null) return;
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
  }, [selectedImage]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";

      return date.toLocaleDateString("lt-LT", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return "";
    }
  };

  const handleLike = async (imageId: number) => {
    if (likeLoading === imageId) return;

    try {
      setLikeLoading(imageId);

      const isLiked = likedImages.has(imageId);
      const action = isLiked ? "unlike" : "like";

      const result = await galleryApi.like(imageId, action);

      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === imageId ? { ...img, likes: result.likes } : img
        )
      );

      setLikedImages((prev) => {
        const newSet = new Set(prev);

        if (isLiked) {
          newSet.delete(imageId);
        } else {
          newSet.add(imageId);
        }

        return newSet;
      });
    } catch {
      // silent
    } finally {
      setLikeLoading(null);
    }
  };

  const filters = useMemo(
    () => [
      { id: "all", label: t("filters.all"), icon: Camera, count: images.length },
      {
        id: "beach",
        label: t("filters.beach"),
        icon: Camera,
        count: images.filter((img) => img.category === "beach").length
      },
      {
        id: "city",
        label: t("filters.city"),
        icon: Camera,
        count: images.filter((img) => img.category === "city").length
      },
      {
        id: "nature",
        label: t("filters.nature"),
        icon: Camera,
        count: images.filter((img) => img.category === "nature").length
      }
    ],
    [images, t]
  );

  const filteredImages = useMemo(() => {
    return activeFilter === "all"
      ? images
      : images.filter((img) => img.category === activeFilter);
  }, [images, activeFilter]);

  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "";
  };

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null || filteredImages.length === 0) return;

    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage);
    if (currentIndex === -1) return;

    let newIndex = 0;

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedImage(filteredImages[newIndex].id);
  };

  const selectedImageData =
    selectedImage !== null
      ? filteredImages.find((img) => img.id === selectedImage) ?? null
      : null;

  useEffect(() => {
    if (selectedImage === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      }

      if (e.key === "ArrowLeft") {
        navigateImage("prev");
      }

      if (e.key === "ArrowRight") {
        navigateImage("next");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, filteredImages]);

  useGSAP(
    () => {
      if (loading || hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          pulseTl.current?.kill();

          pulseTl.current = gsap.timeline({
            repeat: -1,
            repeatDelay: 0.2
          });

          pulseTl.current
            .to(".place1", {
              scale: 1.06,
              duration: 0.35,
              ease: "power1.out"
            })
            .to(".place1", {
              scale: 1,
              duration: 1,
              ease: "power1.inOut"
            })

            .to(
              ".place2",
              {
                scale: 1.06,
                duration: 0.35,
                ease: "power1.out"
              },
              "+=0.05"
            )
            .to(".place2", {
              scale: 1,
              duration: 1,
              ease: "power1.inOut"
            })

            .to(
              ".place3",
              {
                scale: 1.06,
                duration: 0.35,
                ease: "power1.out"
              },
              "+=0.05"
            )
            .to(".place3", {
              scale: 1,
              duration: 1,
              ease: "power1.inOut"
            });
        }
      });

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
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out"
          },
          "-=0.45"
        )
        .to(
          ".thirdAni",
          {
            opacity: 1,
            stagger: 0.06,
            duration: 0.45,
            ease: "power2.out"
          },
          "-=0.2"
        );
    },
    {
      scope: container,
      dependencies: [loading]
    }
  );

  return (
    <div ref={container} className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="firstAni opacity-0 translate-y-5 text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Camera className="text-teal-500" size={32} />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              {t("galleryPage.title.firstPart")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
                {t("galleryPage.title.secondPart")}
              </span>
            </h1>
          </div>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t("galleryPage.subtitle")}
          </p>
        </div>

        <div className="firstAni opacity-0 translate-y-5 grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">{images.length}</div>
            <div className="text-gray-600">{t("galleryPage.stats.photos")}</div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-teal-600 mb-2">
              {images.reduce((sum, img) => sum + img.likes, 0)}
            </div>
            <div className="text-gray-600">{t("galleryPage.stats.likes")}</div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => {
            const IconComponent = filter.icon;

            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`secondAni opacity-0 translate-y-5 flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-teal-50 hover:text-teal-600 shadow-md"
                }`}
              >
                <IconComponent size={18} />
                <span>
                  {filter.label} ({filter.count})
                </span>
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <span className="ml-4 text-gray-600 text-lg">{t("galleryPage.loading")}</span>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <div className="text-red-600 mb-4 text-lg">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              {t("galleryPage.retryButton")}
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => {
              const isLargeCard = index % 7 === 0 || index % 7 === 3;

              return (
                <div
                  key={image.id}
                  className={`thirdAni opacity-0 relative group cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2 ${
                    isLargeCard ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                  onClick={() => openLightbox(image.id)}
                >
                  <Image
                    width={1000}
                    height={1000}
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ minHeight: isLargeCard ? "400px" : "250px" }}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin size={16} />
                        <span className="text-sm">{image.location}</span>
                      </div>

                      <h3 className="font-bold text-lg mb-2">{image.title}</h3>

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm opacity-90 truncate">
                          {t("galleryPage.author")}: {image.photographer}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(image.id);
                          }}
                          disabled={likeLoading === image.id}
                          className={`flex items-center space-x-1 p-1 rounded transition-colors duration-300 shrink-0 ${
                            likedImages.has(image.id)
                              ? "text-red-500 hover:text-red-400"
                              : "text-red-400 hover:text-red-500"
                          }`}
                        >
                          <Heart
                            size={16}
                            className={likeLoading === image.id ? "animate-pulse" : ""}
                            fill={likedImages.has(image.id) ? "currentColor" : "none"}
                          />
                          <span className="text-sm">{image.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        )}

        {selectedImage !== null && selectedImageData && (
          <div
            ref={modalOverlayRef}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4"
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-teal-400 transition-colors duration-300 z-10 bg-black/50 rounded-full p-2"
            >
              <X size={32} />
            </button>

            <button
              onClick={() => navigateImage("prev")}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white hover:text-teal-400 transition-colors duration-300 z-10 bg-black/50 rounded-full p-2 md:p-3"
            >
              <ChevronLeft size={36} className="md:w-12 md:h-12" />
            </button>

            <button
              onClick={() => navigateImage("next")}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white hover:text-teal-400 transition-colors duration-300 z-10 bg-black/50 rounded-full p-2 md:p-3"
            >
              <ChevronRight size={36} className="md:w-12 md:h-12" />
            </button>

            <div
              ref={modalContentRef}
              className="w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="flex-1 min-h-0 flex items-center justify-center">
                <Image
                  width={1000}
                  height={1000}
                  src={selectedImageData.src}
                  alt={selectedImageData.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>

              <div className="shrink-0 bg-white/95 backdrop-blur-sm rounded-lg p-4 md:p-6 mt-3 text-gray-800 overflow-y-auto max-h-[28vh]">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin size={18} className="text-teal-600 shrink-0" />
                      <span className="font-semibold truncate">
                        {selectedImageData.location}
                      </span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold break-words">
                      {selectedImageData.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleLike(selectedImageData.id)}
                    disabled={likeLoading === selectedImageData.id}
                    className={`flex items-center space-x-2 px-3 py-2 md:px-4 rounded-lg transition-colors duration-300 shrink-0 ${
                      likedImages.has(selectedImageData.id)
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "bg-red-50 hover:bg-red-100 text-red-600"
                    }`}
                  >
                    <Heart
                      size={18}
                      className={likeLoading === selectedImageData.id ? "animate-pulse" : ""}
                      fill={likedImages.has(selectedImageData.id) ? "currentColor" : "none"}
                    />
                    <span>{selectedImageData.likes}</span>
                  </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm text-gray-600">
                  <span>
                    {t("galleryPage.author")}: {selectedImageData.photographer}
                  </span>
                  <span>
                    {t("galleryPage.date")}: {formatDate(selectedImageData.date)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-12 text-white text-center">
          <Camera size={64} className="mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">{t("uploadSection.title")}</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {t("uploadSection.description")}{" "}
            <a
              href="mailto:koradiustravel@gmail.com"
              className="text-black hover:text-gray-800 underline transition-colors duration-200"
            >
              koradiustravel@gmail.com
            </a>{" "}
            {t("uploadSection.and")}
          </p>
        </div>

        <div className="mt-16 bg-white rounded-3xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {t("photoContest.title.firstPart")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
                {t("photoContest.title.secondPart")}
              </span>
            </h2>
            <p className="text-lg text-gray-600">{t("photoContest.description")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="place1 text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl">
              <div className="text-4xl mb-4">🥇</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {t("photoContest.firstPlace.title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("photoContest.firstPlace.description")}
              </p>
              <div className="text-2xl font-bold text-yellow-600">
                {t("photoContest.firstPlace.value")}
              </div>
            </div>

            <div className="place2 text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
              <div className="text-4xl mb-4">🥈</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {t("photoContest.secondPlace.title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("photoContest.secondPlace.description")}
              </p>
              <div className="text-2xl font-bold text-gray-600">
                {t("photoContest.secondPlace.value")}
              </div>
            </div>

            <div className="place3 text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <div className="text-4xl mb-4">🥉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {t("photoContest.thirdPlace.title")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("photoContest.thirdPlace.description")}
              </p>
              <div className="text-2xl font-bold text-orange-600">
                {t("photoContest.thirdPlace.value")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}