import { derived } from 'svelte/store';
import { session, quickExitsCount, uniqueGamesVisited, maxTimeInGame, avgSessionDuration } from './session';
import type { Profile } from '$lib/types';

const PROFILE_KEY = 'nuuplayer_profile';

function defaultProfile(): Profile {
  return {
    type: 'Unknown',
    confidence: 0,
    detectedAt: Date.now(),
    reason: 'Aguardando dados suficientes para classificar...',
  };
}

// Profile is derived from session metrics
export const profile = derived(
  [session, quickExitsCount, uniqueGamesVisited, maxTimeInGame, avgSessionDuration],
  ([$session, $quickExits, $uniqueGames, $maxTime, $avgDuration]): Profile => {
    // Rule 1: Impatient — ≥3 quick exits (<15s)
    if ($quickExits >= 3) {
      return {
        type: 'Impatient',
        confidence: Math.min(1, $quickExits / 5),
        detectedAt: Date.now(),
        reason: `Saiu de ${$quickExits} jogos em menos de 15s. Prefere jogos rápidos e casuais.`,
      };
    }

    // Rule 2: Explorer — visited ≥4 different games
    if ($uniqueGames >= 4) {
      return {
        type: 'Explorer',
        confidence: Math.min(1, $uniqueGames / 8),
        detectedAt: Date.now(),
        reason: `Explorou ${$uniqueGames} jogos diferentes. Aprecia variedade e novidades.`,
      };
    }

    // Rule 3: Focused — stayed >90s in a single game
    if ($maxTime > 90) {
      return {
        type: 'Focused',
        confidence: Math.min(1, $maxTime / 180),
        detectedAt: Date.now(),
        reason: `Passou ${Math.round($maxTime)}s em um jogo. Busca experiências profundas.`,
      };
    }

    // Rule 4: Casual — multiple short sessions with low avg duration
    const completedSessions = $session.sessions.filter((s) => s.duration != null);
    if (completedSessions.length >= 2 && $avgDuration < 45 && $quickExits < 2) {
      return {
        type: 'Casual',
        confidence: 0.6,
        detectedAt: Date.now(),
        reason: `Sessões curtas consistentes (~${Math.round($avgDuration)}s). Prefere jogabilidade sem fricção.`,
      };
    }

    return defaultProfile();
  }
);

// Persist profile to localStorage whenever it changes
profile.subscribe((p) => {
  if (typeof localStorage !== 'undefined' && p.type !== 'Unknown') {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
  }
});

// Next threshold description (for debug panel)
export const nextThreshold = derived(
  [session, quickExitsCount, uniqueGamesVisited, maxTimeInGame, avgSessionDuration, profile],
  ([$session, $quickExits, $uniqueGames, $maxTime, $avgDuration, $profile]) => {
    if ($profile.type !== 'Unknown') return 'Perfil detectado ✓';

    const lines: string[] = [];
    const remaining_impatient = Math.max(0, 3 - $quickExits);
    const remaining_explorer = Math.max(0, 4 - $uniqueGames);
    const remaining_focused = Math.max(0, 90 - $maxTime);

    lines.push(`→ Impatient: ${remaining_impatient} saída(s) rápida(s) restante(s)`);
    lines.push(`→ Explorer: ${remaining_explorer} jogo(s) a mais para explorar`);
    lines.push(`→ Focused: ${Math.round(remaining_focused)}s a mais em um jogo`);

    return lines.join('\n');
  }
);
