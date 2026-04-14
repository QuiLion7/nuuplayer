import { writable, derived } from 'svelte/store';
import type { SessionData, GameSession } from '$lib/types';

const STORAGE_KEY = 'nuuplayer_session';

function createInitialSession(): SessionData {
  return {
    sessions: [],
    totalClicks: 0,
    keyboardHits: 0,
    scrollDepth: 0,
    visitedGames: [],
    startTime: Date.now(),
  };
}

function loadSession(): SessionData {
  if (typeof localStorage === 'undefined') return createInitialSession();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) return JSON.parse(raw);
  } catch {
    console.error('Failed to load session from localStorage');
  }
  return createInitialSession();
}

function createSessionStore() {
  const { subscribe, set, update } = writable<SessionData>(loadSession());

  function persist(data: SessionData) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
    return data;
  }

  return {
    subscribe,
    reset() {
      const fresh = createInitialSession();
      set(persist(fresh));
    },
    startGame(gameId: string) {
      update((s) => {
        // Close any open session first
        const sessions = s.sessions.map((sess) => {
          if (!sess.endTime) {
            const now = Date.now();
            const duration = (now - sess.startTime) / 1000;

            return {
              ...sess,
              endTime: now,
              duration,
              quickExit: duration < 15,
            };
          }
          return sess;
        });

        const newSess: GameSession = {
          gameId,
          startTime: Date.now(),
          clicks: 0,
          keyboardHits: 0,
          quickExit: false,
        };

        const visitedGames = s.visitedGames.includes(gameId)
          ? s.visitedGames
          : [...s.visitedGames, gameId];

        return persist({ ...s, sessions: [...sessions, newSess], visitedGames });
      });
    },
    endGame(gameId: string) {
      update((s) => {
        const now = Date.now();
        const sessions = s.sessions.map((sess) => {
          if (sess.gameId === gameId && !sess.endTime) {
            const duration = (now - sess.startTime) / 1000;
            
            return { ...sess, endTime: now, duration, quickExit: duration < 15 };
          }
          return sess;
        });
        return persist({ ...s, sessions });
      });
    },
    incrementClicks() {
      update((s) => {
        const sessions = s.sessions.map((sess, i) => {
          if (i === s.sessions.length - 1 && !sess.endTime) {
            return { ...sess, clicks: sess.clicks + 1 };
          }
          return sess;
        });
        return persist({ ...s, sessions, totalClicks: s.totalClicks + 1 });
      });
    },
    incrementKeyboardHits() {
      update((s) => {
        const sessions = s.sessions.map((sess, i) => {
          if (i === s.sessions.length - 1 && !sess.endTime) {
            return { ...sess, keyboardHits: sess.keyboardHits + 1 };
          }
          return sess;
        });
        return persist({ ...s, sessions, keyboardHits: s.keyboardHits + 1 });
      });
    },
    updateScrollDepth(depth: number) {
      update((s) => {
        if (depth > s.scrollDepth) {
          return persist({ ...s, scrollDepth: depth });
        }
        return s;
      });
    },
  };
}

export const session = createSessionStore();

// Derived: quick exits count
export const quickExitsCount = derived(session, ($s) =>
  $s.sessions.filter((sess) => sess.quickExit).length
);

// Derived: unique games visited
export const uniqueGamesVisited = derived(session, ($s) => $s.visitedGames.length);

// Derived: max time in any single game
export const maxTimeInGame = derived(session, ($s) =>
  Math.max(0, ...$s.sessions.filter((s) => s.duration != null).map((s) => s.duration!))
);

// Derived: average session duration
export const avgSessionDuration = derived(session, ($s) => {
  const completed = $s.sessions.filter((s) => s.duration != null);
  if (!completed.length) return 0;
  return completed.reduce((acc, s) => acc + s.duration!, 0) / completed.length;
});
