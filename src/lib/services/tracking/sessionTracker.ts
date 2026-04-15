import { session } from '$lib/stores/session';
import type { EventTracker, TrackingEvent } from './eventTracker';

// Tracker que envia eventos para o store de sessão
export class SessionTracker implements EventTracker {
  track(event: TrackingEvent): void {
    switch (event.type) {
      case 'click':
        session.incrementClicks();
        break;
      
      case 'keyboard':
        session.incrementKeyboardHits();
        break;
      
      case 'scroll':
        if (event.data?.depth && typeof event.data.depth === 'number') {
          session.updateScrollDepth(event.data.depth);
        }
        break;
      
      case 'game_start':
        if (event.data?.gameId && typeof event.data.gameId === 'string') {
          session.startGame(event.data.gameId);
        }
        break;
      
      case 'game_end':
        if (event.data?.gameId && typeof event.data.gameId === 'string') {
          session.endGame(event.data.gameId);
        }
        break;
    }
  }
}