import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  {
    id: 0,
    tag: "PAN-INDIA LOGISTICS NETWORK",
    headline: "LOGITRACK — India's largest growing logistics platform",
    subtext: "Orchestrating end-to-end supply chain infrastructure from multi-warehouse storage to rapid doorstep fulfillment.",
  },
  {
    id: 1,
    tag: "ENTERPRISE PROVEN & TRUSTED",
    headline: "Trusted by 500+ enterprise businesses across India",
    subtext: "Empowering manufacturers, distributors, and direct-to-consumer leaders with automated routing and 99.8% on-time SLAs.",
  },
  {
    id: 2,
    tag: "INTELLIGENT FLEET TELEMETRY",
    headline: "Real-time tracking, zero delays, full visibility",
    subtext: "Live GPS telemetry, AI predictive delay mitigation, and instant multi-stakeholder milestone notifications.",
  },
];

const AUTO_PLAY_INTERVAL = 3500; // 3.5 seconds

export default function HeroTextCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToSlide = useCallback((index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-slide effect with pause on hover
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isPaused]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
      filter: "blur(4px)",
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        x: { type: "spring", stiffness: 350, damping: 30 },
        opacity: { duration: 0.35, ease: "easeOut" },
        filter: { duration: 0.3 },
      },
    },
    exit: (dir) => ({
      x: dir > 0 ? -30 : 30,
      opacity: 0,
      filter: "blur(4px)",
      transition: {
        x: { duration: 0.25, ease: "easeIn" },
        opacity: { duration: 0.25 },
        filter: { duration: 0.2 },
      },
    }),
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <div
      className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="LogiTrack Key Highlights"
    >
      {/* Slide Text Container */}
      <div className="relative w-full min-h-[150px] sm:min-h-[165px] md:min-h-[175px] flex items-center justify-center overflow-hidden px-2">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full flex flex-col items-center justify-center text-center space-y-2.5 sm:space-y-3"
          >
            {/* Small Badge / Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-[#ea580c] dark:text-[#fb923c] text-[11px] sm:text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ea580c] animate-pulse" />
              {currentSlide.tag}
            </div>

            {/* Main Headline */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.2] max-w-3xl px-2">
              {currentSlide.headline}
            </h2>

            {/* Subtext */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-3">
              {currentSlide.subtext}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Navigation (Arrows + Dots / Dash Bar) - Shiprocket Style */}
      <div className="mt-4 flex items-center justify-center gap-3 sm:gap-4">
        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous highlight"
          className="
            flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full
            bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-md
            border border-slate-200/80 dark:border-white/10
            text-slate-700 dark:text-slate-200 shadow-sm
            transition-all duration-200
            hover:scale-105 hover:bg-white dark:hover:bg-[#27272a]
            hover:border-orange-500/40 hover:text-orange-600 dark:hover:text-orange-400
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500/40
          "
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Dash / Pill Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-1">
          {SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`
                  relative h-2 rounded-full transition-all duration-300 focus:outline-none
                  ${isActive
                    ? "w-7 sm:w-8 bg-[#ea580c] shadow-[0_0_10px_rgba(234,88,12,0.4)]"
                    : "w-2.5 sm:w-3 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40"
                  }
                `}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next highlight"
          className="
            flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full
            bg-white/80 dark:bg-[#18181b]/80 backdrop-blur-md
            border border-slate-200/80 dark:border-white/10
            text-slate-700 dark:text-slate-200 shadow-sm
            transition-all duration-200
            hover:scale-105 hover:bg-white dark:hover:bg-[#27272a]
            hover:border-orange-500/40 hover:text-orange-600 dark:hover:text-orange-400
            active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500/40
          "
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
