'use client';

import React, { useEffect, useRef, useState } from 'react';

// ==========================================
// 1. FADE IN & FADE UP PRIMITIVES
// ==========================================
interface MotionProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}

export function FadeIn({ children, delayMs = 0, className = '' }: MotionProps) {
  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export function FadeUp({ children, delayMs = 0, className = '' }: MotionProps) {
  return (
    <div
      className={`animate-fade-up ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export function FadeDown({ children, delayMs = 0, className = '' }: MotionProps) {
  return (
    <div
      className={`animate-fade-down ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

export function ScaleIn({ children, delayMs = 0, className = '' }: MotionProps) {
  return (
    <div
      className={`animate-scale-in ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

// ==========================================
// 2. STAGGER WRAPPER
// ==========================================
interface StaggerProps {
  children: React.ReactNode;
  delayStepMs?: number;
  className?: string;
}

export function Stagger({ children, delayStepMs = 80, className = '' }: StaggerProps) {
  const childArray = React.Children.toArray(children);
  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <div
          key={index}
          className="animate-fade-up"
          style={{ animationDelay: `${index * delayStepMs}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 3. ANIMATED COUNTER (IntersectionObserver)
// ==========================================
interface AnimatedCounterProps {
  value: number;
  durationMs?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  durationMs = 2000,
  prefix = '',
  suffix = '',
  className = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTimestamp = performance.now();
          const step = (currentTime: number) => {
            const progress = Math.min((currentTime - startTimestamp) / durationMs, 1);
            // Quartic deceleration curve: ultra-smooth, slow intelligent settling
            const easeOutQuartic = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(easeOutQuartic * value);
            setDisplayValue(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setDisplayValue(value);
            }
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [value, durationMs, hasAnimated]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

// ==========================================
// 4. SCROLL REVEAL (IntersectionObserver)
// ==========================================
interface RevealProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'scale-in';
  delayMs?: number;
  className?: string;
}

export function Reveal({
  children,
  animation = 'fade-up',
  delayMs = 0,
  className = ''
}: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  const animClass =
    animation === 'fade-up'
      ? 'animate-fade-up'
      : animation === 'scale-in'
      ? 'animate-scale-in'
      : 'animate-fade-in';

  return (
    <div
      ref={domRef}
      className={`${isVisible ? animClass : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

// ==========================================
// 5. SHIMMER SKELETON LOADERS
// ==========================================
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`skeleton-shimmer animate-shimmer rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-card dark:border-slate-800 dark:bg-slate-900">
      <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4 rounded-full" />
        </div>
      </div>
    </div>
  );
}
