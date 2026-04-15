import { CompositeTracker } from '$lib/services/tracking/eventTracker';
import { SessionTracker } from '$lib/services/tracking/sessionTracker';
import { DOMTracker } from '$lib/services/tracking/domTracker';

// Instância global do sistema de monitoramento
let globalTracker: CompositeTracker | null = null;
let globalDomTracker: DOMTracker | null = null;

// Inicializa o sistema de monitoramento global
export function initTracker(): void {
  if (globalTracker) {
    console.warn('Tracker já foi inicializado');
    return;
  }

  // Cria o monitoramento composto
  globalTracker = new CompositeTracker();

  // Adiciona o monitoramento de sessão
  const sessionTracker = new SessionTracker();
  globalTracker.addTracker(sessionTracker);

  // Cria o monitoramento de DOM que envia eventos diretamente para o sessionTracker
  // NÃO adiciona ao CompositeTracker para evitar loops
  globalDomTracker = new DOMTracker(sessionTracker);
  globalDomTracker.init();
}

// Destrói o sistema de monitoramento global
export function destroyTracker(): void {
  if (globalDomTracker) {
    globalDomTracker.destroy();
    globalDomTracker = null;
  }

  if (globalTracker) {
    globalTracker.destroy();
    globalTracker = null;
  }
}

// Obtém a instância do monitoramento global
export function getTracker(): CompositeTracker | null {
  return globalTracker;
}
// Rastreia o início de um jogo
export function trackGameStart(gameId: string): void {
  globalTracker?.track({
    type: 'game_start',
    data: { gameId }
  });
}

// Rastreia o fim de um jogo
export function trackGameEnd(gameId: string): void {
  globalTracker?.track({
    type: 'game_end',
    data: { gameId }
  });
}
