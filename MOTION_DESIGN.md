# REKSA Global Motion Design System

The REKSA motion-design architecture transforms the platform from a static website into an alive, responsive, intelligent, and premium PropTech software product. Every movement communicates intent, state, causality, or hierarchy while maintaining strict 60fps performance and accessibility compliance.

---

## 1. Animation Tokens & Duration Hierarchy

| Category | Duration | Easing | Primary Use Case |
|---|---|---|---|
| **Micro-Interactions** | `240ms` | `cubic-bezier(0.18, 0.89, 0.32, 1.02)` | Button clicks, heart save toggle, scale taps, icon rotations |
| **Standard Transitions** | `420ms – 500ms` | `cubic-bezier(0.22, 1, 0.36, 1)` | Dropdown menus, tooltips, focus rings, hover card elevation |
| **Medium UI Transitions** | `550ms – 650ms` | `cubic-bezier(0.22, 1, 0.36, 1)` | Modals, comparison dock slide-up, filter panels, tab switches |
| **Hero / Cinematic** | `950ms – 8500ms` | `cubic-bezier(0.25, 1, 0.5, 1)` | Hero Ken Burns slow zoom, slideshow linear progress bar |

### Custom Tailwind Tokens
```ts
transitionDuration: {
  'micro': '240ms',
  'standard': '420ms',
  'medium': '600ms',
  'hero': '950ms',
  'cinematic': '1600ms',
},
transitionTimingFunction: {
  'smart-out': 'cubic-bezier(0.22, 1, 0.36, 1)', // Luxury Apple/Linear exponential deceleration
  'smart-spring': 'cubic-bezier(0.18, 0.89, 0.32, 1.02)', // Weighted natural landing
  'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
}
```

---

## 2. Reusable Motion Components (`@/components/motion/MotionPrimitives`)

### `<FadeIn>` & `<FadeUp>`
Used to sequentially introduce UI groups with subtle vertical translation (`14px → 0px`):
```tsx
import { FadeUp } from '@/components/motion/MotionPrimitives';

<FadeUp delayMs={150}>
  <PropertyCard property={data} />
</FadeUp>
```

### `<Stagger>`
Renders collections (e.g. search suggestions, filter pills) with automatic incremental delays:
```tsx
import { Stagger } from '@/components/motion/MotionPrimitives';

<Stagger delayStepMs={50}>
  {items.map(item => <Item key={item.id} />)}
</Stagger>
```

### `<AnimatedCounter>`
Uses `IntersectionObserver` and `requestAnimationFrame` to roll real database numbers upward when entering the viewport:
```tsx
import { AnimatedCounter } from '@/components/motion/MotionPrimitives';

<AnimatedCounter value={totalProperties} suffix=" Listings" durationMs={1200} />
```

### `<Skeleton>` & `<PropertyCardSkeleton>`
Provides continuous animated shimmer placeholder cards matching exact layout dimensions during initial SSR / query states:
```tsx
import { PropertyCardSkeleton } from '@/components/motion/MotionPrimitives';

{loading ? <PropertyCardSkeleton /> : <PropertyCard property={data} />}
```

---

## 3. Global Notification & Comparison Architecture

### Toast Notification System (`ToastProvider.tsx`)
Non-intrusive notification manager docked at the bottom-right:
- Automatically triggers on property bookmark/save: `"Property saved to watchlist"`
- Automatically triggers on property comparison toggle: `"Added to comparison (3/5)"`
- Auto-dismisses in 3.5 seconds or on manual close
- Fully accessible via `aria-live="polite"`

### Sticky Comparison Tray (`ComparisonTray.tsx`)
Persistent floating dock centered at the viewport bottom:
- Appears when `comparisonList.length > 0` with `animate-slide-up`
- Previews thumbnail cards, live count (`3 / 5`), and quick remove buttons
- Direct action button to `/compare` algorithmic matrix

---

## 4. Radial Trust Score & Verification Timeline

### `<TrustScore>`
- Circular SVG stroke draws dynamically from 0 to actual rating (`strokeDasharray`)
- Inner number counts upward in real-time
- Hovering reveals a transparent factor breakdown:
  - Title Deed Registry (25 pts)
  - Cadastral GPS Boundary (20 pts)
  - Physical Inspection (20 pts)
  - Owner Identity KYC (20 pts)
  - Rates & Encumbrance (15 pts)

---

## 5. Performance Guidelines (60fps Target)

1. **Only Animate Composited Properties**:
   - Strictly prefer `transform` (`translate3d`, `scale`) and `opacity`.
   - Avoid animating `width`, `height`, `margin`, or `left`/`top` to prevent expensive browser recalculate-style / layout thrashing.
2. **GPU Layers**:
   - High-frequency surfaces utilize `.gpu-layer` (`transform: translateZ(0); backface-visibility: hidden;`).
3. **Zero Heavy Runtime Overhead**:
   - All animations run on native CSS3 hardware acceleration without heavy third-party animation JavaScript bundles.

---

## 6. Accessibility & Reduced Motion

REKSA strictly complies with WCAG 2.1 Level AAA motion standards:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
When a user has "Reduce Motion" enabled in Windows or macOS settings:
- Zoom and slideshow Ken Burns effects are immediately bypassed.
- Animated counters directly render the final numeric value.
- Transitions and reveals apply instantly without delay or disorientation.
