/**
 * Testes para o módulo validation.ts
 *
 * Como rodar: npm run test
 *
 * O que é testado aqui?
 *   - validateProfile: se rejeita dados inválidos e aceita dados corretos
 *   - sanitizeSessionData: se retorna valores padrão quando os dados são corrompidos
 *
 * Por que validação é importante?
 *   Os dados vêm do localStorage (salvos pelo browser), então podem estar
 *   corrompidos, desatualizados ou manipulados pelo usuário. A validação
 *   protege a aplicação de crashar por dados inesperados.
 */

import { describe, it, expect } from 'vitest';
import { validateProfile, sanitizeSessionData } from './validation';

// ─────────────────────────────────────────────────────────────
// 1. validateProfile — validação de dados de perfil
// ─────────────────────────────────────────────────────────────
describe('validateProfile', () => {
  it('aceita um perfil com todos os campos válidos', () => {
    const perfilValido = {
      type: 'Impatient',
      confidence: 0.85,
      detectedAt: Date.now(),
      reason: 'Clicou rapidamente em vários jogos',
    };

    // Deve retornar o próprio objeto, não null
    expect(validateProfile(perfilValido)).not.toBeNull();
  });

  it('rejeita um perfil com tipo desconhecido', () => {
    const perfilInvalido = {
      type: 'Hacker', // tipo que não existe no sistema
      confidence: 1,
      detectedAt: Date.now(),
      reason: 'Teste',
    };

    expect(validateProfile(perfilInvalido)).toBeNull();
  });

  it('rejeita um perfil sem o campo "confidence"', () => {
    const perfilIncompleto = {
      type: 'Casual',
      detectedAt: Date.now(),
      reason: 'Navegou devagar',
      // confidence está faltando
    };

    expect(validateProfile(perfilIncompleto)).toBeNull();
  });

  it('rejeita null e undefined', () => {
    expect(validateProfile(null)).toBeNull();
    expect(validateProfile(undefined)).toBeNull();
  });

  it('rejeita uma string pura (não é um objeto)', () => {
    expect(validateProfile('Impatient')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────
// 2. sanitizeSessionData — recuperação de dados corrompidos
// ─────────────────────────────────────────────────────────────
describe('sanitizeSessionData', () => {
  it('retorna dados padrão (zerados) quando recebe null', () => {
    const resultado = sanitizeSessionData(null);

    // Todos os contadores devem começar zerados
    expect(resultado.totalClicks).toBe(0);
    expect(resultado.keyboardHits).toBe(0);
    expect(resultado.sessions).toEqual([]);
    expect(resultado.visitedGames).toEqual([]);
  });

  it('retorna dados padrão quando recebe um objeto vazio', () => {
    const resultado = sanitizeSessionData({});

    expect(resultado.scrollDepth).toBe(0);
  });

  it('retorna os dados originais quando recebe uma sessão válida', () => {
    const sessaoValida = {
      sessions: [],
      totalClicks: 42,
      keyboardHits: 10,
      scrollDepth: 0.5,
      visitedGames: ['svelte-snake'],
      startTime: 1000000,
    };

    const resultado = sanitizeSessionData(sessaoValida);

    // Os dados válidos devem ser preservados
    expect(resultado.totalClicks).toBe(42);
    expect(resultado.visitedGames).toContain('svelte-snake');
  });

  it('retorna dados padrão quando recebe uma string aleatória', () => {
    const resultado = sanitizeSessionData('dados corrompidos');

    expect(resultado.totalClicks).toBe(0);
    expect(resultado.sessions).toHaveLength(0);
  });
});
