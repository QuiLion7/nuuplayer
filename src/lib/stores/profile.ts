import { derived } from 'svelte/store';
import { session, quickExitsCount, uniqueGamesVisited, maxTimeInGame, avgSessionDuration } from './session';
import { StorageService } from '$lib/services/storageService';
import type { Profile } from '$lib/types';

// Cria um perfil padrão quando não há dados suficientes
function defaultProfile(): Profile {
  return {
    type: 'Unknown',
    confidence: 0,
    detectedAt: Date.now(),
    reason: 'Aguardando dados suficientes para classificar...',
  };
}

// Store derivado que detecta o perfil do usuário baseado em métricas de sessão
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

// Persiste o perfil no localStorage quando detectado
profile.subscribe((p) => {
  if (p.type !== 'Unknown') {
    StorageService.saveProfile(p);
  }
});

// Store derivado que mostra o próximo threshold para detecção de perfil
export const nextThreshold = derived(
  [quickExitsCount, uniqueGamesVisited, maxTimeInGame, profile],
  ([$quickExits, $uniqueGames, $maxTime, $profile]) => {
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
