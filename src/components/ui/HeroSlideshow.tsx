'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Bot,
  MapPin,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ArrowRight
} from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  tagline: string;
  title: string;
  highlight: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=2000&q=85',
    tagline: 'Kenya’s Property Intelligence & Verification Platform',
    title: 'Discover Property',
    highlight: 'With Confidence.',
    description: 'Explore verified apartments, residences and commercial investments across all 47 counties with digital property passports and transparent land data.',
    primaryCtaText: 'Explore Apartments for Sale',
    primaryCtaHref: '/apartments-for-sale',
    secondaryCtaText: 'Ask A&E AI Advisor',
    secondaryCtaHref: '/ai-advisor'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=85',
    tagline: 'Verified Kenyan Urban Residences',
    title: 'Find Apartments That Fit',
    highlight: 'Your Lifestyle.',
    description: 'Browse modern 1, 2, 3-bedroom and penthouse apartments for rent and sale with verified building amenities, service charges, and water reliability checks.',
    primaryCtaText: 'Browse Rental Apartments',
    primaryCtaHref: '/apartments-for-rent',
    secondaryCtaText: 'Interactive Map',
    secondaryCtaHref: '/map'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85',
    tagline: 'Predictive PropTech Analytics',
    title: 'Invest With Better',
    highlight: 'Property Intelligence.',
    description: 'Analyse rental yields, submarket price-per-square-metre benchmarks, infrastructure developments, and risk signals across Nairobi, Kiambu, Mombasa, and Nakuru.',
    primaryCtaText: 'Investment Calculator',
    primaryCtaHref: '/tools/investment',
    secondaryCtaText: 'Compare Properties',
    secondaryCtaHref: '/compare'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
    tagline: 'Master-Planned Communities & Land',
    title: 'Explore Kenya’s Growing',
    highlight: 'Property Market.',
    description: 'Track developer construction milestones, verified beacons, zoning regulations, and off-plan residences with certified engineering inspections.',
    primaryCtaText: 'Track Developments',
    primaryCtaHref: '/developments',
    secondaryCtaText: 'Land Intelligence',
    secondaryCtaHref: '/land'
  }
];

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    // Check user accessibility preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(nextSlide, 8500);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying((prev) => !prev);
    }
  };

  // Touch gesture swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    }
    if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <section
      aria-label="Real estate featured highlights"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-[620px] sm:h-[680px] lg:h-[720px] w-full overflow-hidden bg-slate-950 text-white focus:outline-none"
    >
      {/* Background Images with Crossfade & Subtle Ken Burns Zoom */}
      {SLIDES.map((s, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={s.id}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt={s.title}
              className={`h-full w-full object-cover object-center ${
                !isReducedMotion && isActive ? 'scale-105 transition-transform duration-[8500ms] ease-out' : 'scale-100'
              }`}
            />
            {/* Dark & Forest Green Vignette Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
          </div>
        );
      })}

      {/* Content Container with Sequential Staggered Entrance */}
      <div className="relative z-20 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div key={currentSlide} className="max-w-3xl">
          {/* 1. Tagline Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/70 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md mb-5 animate-fade-down [animation-delay:100ms]">
            <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <span>{slide.tagline}</span>
          </div>

          {/* 2. Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white animate-fade-up [animation-delay:250ms]">
            {slide.title}{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              {slide.highlight}
            </span>
          </h1>

          {/* 3. Description */}
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed animate-fade-up [animation-delay:450ms]">
            {slide.description}
          </p>

          {/* 4. Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5 animate-fade-up [animation-delay:650ms]">
            <Link
              href={slide.primaryCtaHref}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-premium transition-all duration-300 hover:scale-105 hover:bg-emerald-500 active:scale-[0.98] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <span>{slide.primaryCtaText}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={slide.secondaryCtaHref}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/80 px-5 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md hover:border-slate-500 hover:bg-slate-800 transition-all duration-300 active:scale-[0.98] focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <span>{slide.secondaryCtaText}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Controls & Real-Time Slide Progress Bar */}
      <div className="absolute bottom-6 left-0 right-0 z-30 mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Indicators + Slide Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {SLIDES.map((s, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className="relative h-2 w-10 sm:w-12 rounded-full overflow-hidden bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  {isActive && (
                    <div
                      key={`prog-${currentSlide}-${isPlaying}`}
                      className="absolute inset-0 bg-emerald-400 rounded-full"
                      style={{
                        animation: isPlaying && !isReducedMotion ? 'shimmer 8.5s linear infinite' : 'none',
                        width: '100%'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Elegant Slide Counter: 01 / 04 */}
          <div className="text-xs font-mono font-bold tracking-widest text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-full border border-slate-800 backdrop-blur-md">
            <span className="text-emerald-400">0{currentSlide + 1}</span> / 0{SLIDES.length}
          </div>
        </div>

        {/* Play/Pause & Arrow Nav */}
        <div className="flex items-center gap-2 bg-slate-950/60 p-1.5 rounded-full border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => setIsPlaying((prev) => !prev)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            className="rounded-full p-1.5 text-slate-300 hover:text-white transition-colors active:scale-95"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="rounded-full p-1.5 text-slate-300 hover:text-white transition-colors active:scale-95"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="rounded-full p-1.5 text-slate-300 hover:text-white transition-colors active:scale-95"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}