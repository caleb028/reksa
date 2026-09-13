'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';

interface GalleryImage {
  id?: string;
  url: string;
  caption?: string | null;
  roomType?: string | null;
  isPrimary?: boolean;
  aiQualityScore?: number | null;
}

interface PropertyGalleryProps {
  images: GalleryImage[];
  propertyTitle: string;
}

export function PropertyGallery({ images, propertyTitle }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fallbackList: GalleryImage[] = [
    {
      url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1400&q=85',
      caption: 'Modern Living Area with Natural Sunlight',
      roomType: 'Living'
    },
    {
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      caption: 'Fitted Kitchen with Quartz Countertops',
      roomType: 'Kitchen'
    },
    {
      url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
      caption: 'Master Bedroom Ensuite',
      roomType: 'Bedroom'
    }
  ];

  const galleryImages = images && images.length > 0 ? images : fallbackList;

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const prevImage = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, nextImage, prevImage]);

  // Touch swipe support for lightbox
  const touchStartX = useRef<number>(0);
  const handleLightboxTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };
  const handleLightboxTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    if (touchStartX.current - endX > 50) nextImage();
    if (endX - touchStartX.current > 50) prevImage();
  };

  const currentImg = galleryImages[selectedIndex];

  return (
    <div className="relative mb-10">
      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Large Feature View (3 cols on desktop) */}
        <div className="relative md:col-span-3 aspect-[16/10] overflow-hidden rounded-3xl bg-slate-200 dark:bg-slate-800 shadow-md group">
          <img
            key={selectedIndex}
            src={currentImg.url}
            alt={currentImg.caption || propertyTitle}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-103 animate-fade-in"
          />

          {/* Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

          {/* Room Label Badge */}
          {currentImg.roomType && (
            <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
              <Camera className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentImg.roomType}</span>
            </div>
          )}

          {/* AI Photo Quality Score */}
          {currentImg.aiQualityScore && (
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Photo Quality: {currentImg.aiQualityScore}%</span>
            </div>
          )}

          {/* Caption & Fullscreen CTA */}
          <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-white drop-shadow-md truncate max-w-md">
              {currentImg.caption || `Image ${selectedIndex + 1} of ${galleryImages.length}`}
            </span>

            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-lg backdrop-blur-md hover:bg-white transition-all active:scale-95"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Fullscreen Gallery</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Sidebar (1 col on desktop) */}
        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[460px] pb-2 md:pb-0 scrollbar-thin">
          {galleryImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-[16/10] flex-shrink-0 w-32 md:w-full overflow-hidden rounded-2xl bg-slate-100 transition-all duration-200 active:scale-95 ${
                  isSelected
                    ? 'ring-3 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 scale-[1.02] shadow-md opacity-100'
                    : 'opacity-70 hover:opacity-100 hover:scale-[1.01]'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.caption || `Thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                />
                {img.roomType && (
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-slate-950/80 px-1.5 py-0.5 text-[9px] font-bold text-white backdrop-blur-sm">
                    {img.roomType}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          onTouchStart={handleLightboxTouchStart}
          onTouchEnd={handleLightboxTouchEnd}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in"
        >
          {/* Top Bar (Close & Count) */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
            <span className="text-xs font-mono font-bold text-slate-300">
              {selectedIndex + 1} / {galleryImages.length} • {currentImg.caption || propertyTitle}
            </span>

            <button
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen gallery"
              className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-all active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prev Button */}
          <button
            onClick={prevImage}
            aria-label="Previous photo"
            className="absolute left-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/25 transition-all active:scale-90 hover:scale-105 z-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Large Image View */}
          <div className="max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl animate-scale-in">
            <img
              key={`lightbox-${selectedIndex}`}
              src={currentImg.url}
              alt={currentImg.caption || propertyTitle}
              className="h-auto max-h-[85vh] w-auto max-w-full object-contain animate-fade-in"
            />
          </div>

          {/* Next Button */}
          <button
            onClick={nextImage}
            aria-label="Next photo"
            className="absolute right-6 rounded-full bg-white/10 p-3 text-white hover:bg-white/25 transition-all active:scale-90 hover:scale-105 z-50"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}