// src/components/home/BannerSlider.tsx
"use client";

import { useEffect, useState, useRef, TouchEvent } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  // TODO: GANTI_DENGAN_GAMBAR_ASLI — sementara pakai gradient sebagai placeholder visual
  gradientClassName: string;
}

// TODO: GANTI_DENGAN_DATA_BANNER_ASLI_ANDA (idealnya diambil dari CMS/database, bukan hardcode)
const DEFAULT_SLIDES: BannerSlide[] = [
  {
    id: "promo-banner",
    title: "Cetak Banner Mulai Rp20.000/m²",
    subtitle: "Indoor & Outdoor, siap kirim dalam 1-3 hari kerja.",
    ctaLabel: "Pesan Banner",
    ctaHref: "/produk?kategori=banner",
    gradientClassName: "from-red-600 to-red-800",
  },
  {
    id: "promo-merchandise",
    title: "Merchandise Custom untuk Event & Perusahaan",
    subtitle: "Plakat, ID Card, Mug, Lanyard, dan banyak lagi.",
    ctaLabel: "Lihat Merchandise",
    ctaHref: "/produk?kategori=merchandise",
    gradientClassName: "from-gray-800 to-gray-950",
  },
  {
    id: "promo-buku",
    title: "Buku Custom & Yearbook Sekolah",
    subtitle: "Hardcover maupun softcover, dengan simulator spin otomatis.",
    ctaLabel: "Coba Simulator",
    ctaHref: "/simulator",
    gradientClassName: "from-red-700 to-gray-900",
  },
];

const AUTOPLAY_INTERVAL_MS = 5000;
const SWIPE_THRESHOLD_PX = 50;

interface BannerSliderProps {
  slides?: BannerSlide[];
}

export default function BannerSlider({ slides = DEFAULT_SLIDES }: BannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function goTo(index: number) {
    setActiveIndex((index + slides.length) % slides.length);
  }

  // Autoplay — berhenti otomatis jika hanya ada 1 slide.
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => goTo(activeIndex + 1), AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [activeIndex, slides.length]);

  // Fitur swipe mode (mobile).
  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: TouchEvent<HTMLDivElement>) {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      // swipe kiri -> next, swipe kanan -> prev
      goTo(activeIndex + (deltaX < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  }

  const slide = slides[activeIndex];

  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`flex min-h-[280px] flex-col items-start justify-center gap-4 bg-gradient-to-br ${slide.gradientClassName} px-6 py-10 text-white sm:min-h-[360px] sm:px-12`}
      >
        <h1 className="max-w-xl text-2xl font-bold sm:text-4xl">{slide.title}</h1>
        <p className="max-w-lg text-sm text-white/80 sm:text-base">{slide.subtitle}</p>
        <Link
          href={slide.ctaHref}
          className="mt-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-brand transition hover:bg-gray-100"
        >
          {slide.ctaLabel}
        </Link>
      </div>

      {/* Panah navigasi — desktop */}
      <button
        onClick={() => goTo(activeIndex - 1)}
        aria-label="Slide sebelumnya"
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30 sm:block"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => goTo(activeIndex + 1)}
        aria-label="Slide berikutnya"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30 sm:block"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicator */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((s, index) => (
          <button
            key={s.id}
            onClick={() => goTo(index)}
            aria-label={`Ke slide ${index + 1}`}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
