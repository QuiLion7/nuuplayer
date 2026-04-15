import { writable, derived } from 'svelte/store';
import { StorageService } from '$lib/services/storageService';
import type { SessionData, GameSession } from '$lib/types';

function createSessionStore() {
  const { subscribe, set, update } = writable<SessionData>(StorageService.loadSession());

  function persist(data: SessionData): SessionData {
    StorageService.saveSession(data);
    return data;
  }

  return {
    subscribe,
    reset() {
      const fresh: SessionData = {
        sessions: [],
        totalClicks: 0,
        keyboardHits: 0,
        scrollDepth: 0,
        visitedGames: [],
        startTime: Date.now(),
      };
      set(persist(fresh));
    },
    startGame(gameId: string) {
      update((s) => {
        // Primeirto fechar qualquer sessão aberta
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

// Derived: contagem de saídas rápidas
export const quickExitsCount = derived(session, ($s) =>
  $s.sessions.filter((sess) => sess.quickExit).length
);

// Derived: jogos únicos visitados
export const uniqueGamesVisited = derived(session, ($s) => $s.visitedGames.length);

// Derived: tempo máximo em qualquer partida
export const maxTimeInGame = derived(session, ($s) =>
  Math.max(0, ...$s.sessions.filter((s) => s.duration != null).map((s) => s.duration!))
);

// Derived: duração média da sessão
export const avgSessionDuration = derived(session, ($s) => {
  const completed = $s.sessions.filter((s) => s.duration != null);

  if (!completed.length) return 0;
  
  return completed.reduce((acc, s) => acc + s.duration!, 0) / completed.length;
});
