/**
 * Testes para o GameScorer — sistema de pontuação de jogos por perfil
 *
 * Como rodar: npm run test
 *
 * O que é testado aqui?
 *   - scoreGame: se jogos de categorias prioritárias recebem pontuação maior
 *   - reorderGames: se jogos são reordenados corretamente para um perfil
 *   - isGamePriority: se identifica corretamente se um jogo é prioritário
 *
 * Estrutura de um teste:
 *   1. "Arrange" → prepara os dados que serão usados
 *   2. "Act"     → chama a função que está sendo testada
 *   3. "Assert"  → verifica se o resultado é o esperado
 */

import { describe, it, expect } from 'vitest';
import { GameScorer } from './gameScorer';
import type { GameInterface } from '$lib/types';

// Instância do serviço — assim como a aplicação usa
const scorer = new GameScorer();

// ─────────────────────────────────────────────────────────────
// Dados de exemplo para usar nos testes
// ─────────────────────────────────────────────────────────────

/** Jogo rápido de arcade — ideal para perfil Impatient */
const jogoRapido: GameInterface = {
  id: 'jogo-rapido',
  title: 'Jogo Rápido',
  description: 'Um jogo veloz.',
  category: 'arcade',
  tags: ['fast', 'reflex'],
  coverColor: '#000',
  icon: '⚡',
  durationEstimate: '~1 min',
  isFast: true,
};

/** Jogo de puzzle calmo — ideal para perfil Explorer */
const jogoPuzzle: GameInterface = {
  id: 'jogo-puzzle',
  title: 'Jogo Puzzle',
  description: 'Um jogo de lógica.',
  category: 'puzzle',
  tags: ['logic', 'calm'],
  coverColor: '#000',
  icon: '🧩',
  durationEstimate: '~5 min',
  isFast: false,
};

// ─────────────────────────────────────────────────────────────
// 1. scoreGame — pontuação de jogos por perfil
// ─────────────────────────────────────────────────────────────
describe('GameScorer.scoreGame', () => {
  it('dá pontuação maior para um jogo rápido quando o perfil é Impatient', () => {
    const pontuacaoRapido = scorer.scoreGame(jogoRapido, 'Impatient');
    const pontuacaoPuzzle = scorer.scoreGame(jogoPuzzle, 'Impatient');

    // O jogo rápido deve ter pontuação maior para o perfil Impaciente
    expect(pontuacaoRapido).toBeGreaterThan(pontuacaoPuzzle);
  });

  it('dá pontuação maior para um puzzle quando o perfil é Explorer', () => {
    const pontuacaoRapido = scorer.scoreGame(jogoRapido, 'Explorer');
    const pontuacaoPuzzle = scorer.scoreGame(jogoPuzzle, 'Explorer');

    expect(pontuacaoPuzzle).toBeGreaterThan(pontuacaoRapido);
  });

  it('retorna pontuação zero para qualquer jogo com perfil Unknown', () => {
    expect(scorer.scoreGame(jogoRapido, 'Unknown')).toBe(0);
    expect(scorer.scoreGame(jogoPuzzle, 'Unknown')).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────
// 2. reorderGames — reordenação da lista de jogos
// ─────────────────────────────────────────────────────────────
describe('GameScorer.reorderGames', () => {
  it('coloca o jogo rápido na frente para o perfil Impatient', () => {
    // Arrange: lista com o puzzle primeiro, o rápido depois
    const lista = [jogoPuzzle, jogoRapido];

    // Act
    const reordenada = scorer.reorderGames(lista, 'Impatient');

    // Assert: o primeiro da lista deve ser o jogo rápido
    expect(reordenada[0].id).toBe('jogo-rapido');
  });

  it('coloca o puzzle na frente para o perfil Focused', () => {
    const lista = [jogoRapido, jogoPuzzle];
    const reordenada = scorer.reorderGames(lista, 'Focused');

    expect(reordenada[0].id).toBe('jogo-puzzle');
  });

  it('mantém todos os jogos na lista após reordenar', () => {
    const lista = [jogoRapido, jogoPuzzle];
    const reordenada = scorer.reorderGames(lista, 'Explorer');

    // Nenhum jogo pode ser perdido na reordenação
    expect(reordenada).toHaveLength(lista.length);
  });
});

// ─────────────────────────────────────────────────────────────
// 3. isGamePriority — identifica se um jogo é prioritário
// ─────────────────────────────────────────────────────────────
describe('GameScorer.isGamePriority', () => {
  it('considera o jogo rápido como prioritário para Impatient', () => {
    expect(scorer.isGamePriority(jogoRapido, 'Impatient')).toBe(true);
  });

  it('considera o jogo puzzle como prioritário para Explorer', () => {
    expect(scorer.isGamePriority(jogoPuzzle, 'Explorer')).toBe(true);
  });

  it('nunca considera nenhum jogo como prioritário para Unknown', () => {
    expect(scorer.isGamePriority(jogoRapido, 'Unknown')).toBe(false);
    expect(scorer.isGamePriority(jogoPuzzle, 'Unknown')).toBe(false);
  });
});
