import type { SessionData, GameSession, Profile } from '$lib/types';

// Verifica se um valor é um objeto válido
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Verifica se um valor é um array válido
function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

// Valida uma sessão de jogo individual
function validateGameSession(session: unknown): session is GameSession {
  if (!isObject(session)) return false;

  const requiredFields = ['gameId', 'startTime', 'clicks', 'keyboardHits', 'quickExit'];
  
  for (const field of requiredFields) {
    if (!(field in session)) return false;
  }

  return (
    typeof session.gameId === 'string' &&
    typeof session.startTime === 'number' &&
    typeof session.clicks === 'number' &&
    typeof session.keyboardHits === 'number' &&
    typeof session.quickExit === 'boolean' &&
    (session.endTime === undefined || typeof session.endTime === 'number') &&
    (session.duration === undefined || typeof session.duration === 'number')
  );
}

// Valida dados de sessão completos
export function validateSessionData(data: unknown): SessionData | null {
  if (!isObject(data)) return null;

  const requiredFields = ['sessions', 'totalClicks', 'keyboardHits', 'scrollDepth', 'visitedGames', 'startTime'];
  
  for (const field of requiredFields) {
    if (!(field in data)) return null;
  }

  if (!isArray(data.sessions) || !isArray(data.visitedGames)) return null;

  // Valida cada sessão individual
  for (const session of data.sessions) {
    if (!validateGameSession(session)) return null;
  }

  // Valida tipos dos campos obrigatórios
  if (
    typeof data.totalClicks !== 'number' ||
    typeof data.keyboardHits !== 'number' ||
    typeof data.scrollDepth !== 'number' ||
    typeof data.startTime !== 'number'
  ) {
    return null;
  }

  // Valida que visitedGames contém apenas strings
  for (const gameId of data.visitedGames) {
    if (typeof gameId !== 'string') return null;
  }

  return data as unknown as SessionData;
}

// Valida dados de perfil
export function validateProfile(data: unknown): Profile | null {
  if (!isObject(data)) return null;

  const requiredFields = ['type', 'confidence', 'detectedAt', 'reason'];
  
  for (const field of requiredFields) {
    if (!(field in data)) return null;
  }

  const validProfileTypes = ['Unknown', 'Impatient', 'Explorer', 'Focused', 'Casual'];
  
  if (
    !validProfileTypes.includes(data.type as string) ||
    typeof data.confidence !== 'number' ||
    typeof data.detectedAt !== 'number' ||
    typeof data.reason !== 'string'
  ) {
    return null;
  }

  return data as unknown as Profile;
}

// Sanitiza dados corrompidos, retornando valores padrão quando necessário
export function sanitizeSessionData(data: unknown): SessionData {
  const validated = validateSessionData(data);
  
  if (validated) return validated;

  // Retorna dados padrão se a validação falhar
  return {
    sessions: [],
    totalClicks: 0,
    keyboardHits: 0,
    scrollDepth: 0,
    visitedGames: [],
    startTime: Date.now(),
  };
}