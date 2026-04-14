import { session } from '$lib/stores/session';

let scrollHandler: ((e: Event) => void) | null = null;
let clickHandler: ((e: Event) => void) | null = null;
let keydownHandler: ((e: KeyboardEvent) => void) | null = null;

// Attach global tracking listeners to the document
export function initTracker() {
  if (typeof document === 'undefined') return;

  // Track clicks
  clickHandler = () => {
    session.incrementClicks();
  };
  document.addEventListener('click', clickHandler);

  // Track keyboard hits (for navigation)
  keydownHandler = (e: KeyboardEvent) => {
    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Spacebar', 'Enter', 'Backspace'];

    if (keys.includes(e.key)) {
      // Ignore typing
      const tag = (e.target as HTMLElement)?.tagName;

      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return;
      session.incrementKeyboardHits();
    }
  };
  window.addEventListener('keydown', keydownHandler);

  // Track scroll depth
  scrollHandler = () => {
    const scrolled = window.scrollY + window.innerHeight;
    const total = document.documentElement.scrollHeight;
    const depth = Math.round((scrolled / total) * 100);

    session.updateScrollDepth(depth);
  };
  window.addEventListener('scroll', scrollHandler, { passive: true });
}

/** Remove global tracking listeners */
export function destroyTracker() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (clickHandler) document.removeEventListener('click', clickHandler);
  if (scrollHandler) window.removeEventListener('scroll', scrollHandler);
  if (keydownHandler) window.removeEventListener('keydown', keydownHandler);
  
  clickHandler = null;
  scrollHandler = null;
  keydownHandler = null;
}
