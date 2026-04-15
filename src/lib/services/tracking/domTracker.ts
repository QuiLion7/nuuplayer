import type { EventTracker, TrackingEvent } from './eventTracker';

// Tracker que monitora eventos do DOM
export class DOMTracker implements EventTracker {
  private eventTracker: EventTracker;
  private clickHandler?: (e: Event) => void;
  private keydownHandler?: (e: KeyboardEvent) => void;
  private scrollHandler?: (e: Event) => void;

  constructor(eventTracker: EventTracker) {
    this.eventTracker = eventTracker;
  }

  // Inicia o monitoramento de eventos do DOM
  init(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    this.setupClickTracking();
    this.setupKeyboardTracking();
    this.setupScrollTracking();
  }

  // Configura tracking de cliques
  private setupClickTracking(): void {
    this.clickHandler = () => {
      this.track({ type: 'click' });
    };
    document.addEventListener('click', this.clickHandler);
  }

  // Configura tracking de teclado
  private setupKeyboardTracking(): void {
    const trackedKeys = [
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 
      ' ', 'Spacebar', 'Enter', 'Backspace'
    ];

    this.keydownHandler = (e: KeyboardEvent) => {
      if (!trackedKeys.includes(e.key)) return;

      // Ignora se estiver digitando
      const target = e.target as HTMLElement;
      const tag = target?.tagName;
      
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) {
        return;
      }

      this.track({ 
        type: 'keyboard', 
        data: { key: e.key } 
      });
    };

    window.addEventListener('keydown', this.keydownHandler);
  }

  // Configura tracking de scroll
  private setupScrollTracking(): void {
    let ticking = false;

    this.scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.scrollY + window.innerHeight;
          const total = document.documentElement.scrollHeight;
          const depth = Math.round((scrolled / total) * 100);

          this.track({ 
            type: 'scroll', 
            data: { depth } 
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  track(event: TrackingEvent): void {
    this.eventTracker.track(event);
  }

  destroy(): void {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      return;
    }

    if (this.clickHandler) {
      document.removeEventListener('click', this.clickHandler);
    }
    
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
    }
    
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }

    this.clickHandler = undefined;
    this.keydownHandler = undefined;
    this.scrollHandler = undefined;
  }
}