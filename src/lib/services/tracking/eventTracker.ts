// Tipos de eventos que podem ser rastreados
export interface TrackingEvent {
  type: 'click' | 'keyboard' | 'scroll' | 'game_start' | 'game_end';
  data?: Record<string, unknown>;
  timestamp?: number;
}

// Interface para implementações de tracking
export interface EventTracker {
  track(event: TrackingEvent): void;
  destroy?(): void;
}

// Tracker composto que permite múltiplas implementações
export class CompositeTracker implements EventTracker {
  private trackers: EventTracker[] = [];

  constructor(trackers: EventTracker[] = []) {
    this.trackers = trackers;
  }

  addTracker(tracker: EventTracker): void {
    this.trackers.push(tracker);
  }

  removeTracker(tracker: EventTracker): void {
    const index = this.trackers.indexOf(tracker);
    if (index > -1) {
      this.trackers.splice(index, 1);
    }
  }

  track(event: TrackingEvent): void {
    const eventWithTimestamp = {
      ...event,
      timestamp: event.timestamp || Date.now()
    };

    this.trackers.forEach(tracker => {
      try {
        tracker.track(eventWithTimestamp);
      } catch (error) {
        console.error('Erro no tracker:', error);
      }
    });
  }

  destroy(): void {
    this.trackers.forEach(tracker => {
      try {
        tracker.destroy?.();
      } catch (error) {
        console.error('Erro ao destruir tracker:', error);
      }
    });
    this.trackers = [];
  }
}