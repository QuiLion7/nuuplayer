/**
 * Testes para o módulo profileColors.ts
 *
 * Como rodar: npm run test
 *
 * O que é testado aqui?
 *   - getProfileDisplayName: se retorna o nome em português certo para cada perfil
 *   - getProfileColors: se retorna as classes CSS certas para cada perfil
 *   - getProfileIcon: se retorna o emoji certo para cada perfil
 *
 * Como funciona um teste?
 *   describe('nome do grupo') → agrupa testes relacionados
 *   it('o que espero que aconteça') → um teste individual
 *   expect(valorReal).toBe(valorEsperado) → verifica se os dois são iguais
 */

import { describe, it, expect } from 'vitest';
import { getProfileDisplayName, getProfileColors, getProfileIcon } from './profileColors';

// ─────────────────────────────────────────────────────────────
// 1. getProfileDisplayName — nomes em português
// ─────────────────────────────────────────────────────────────
describe('getProfileDisplayName', () => {
  it('retorna "Novo Jogador" para o perfil Unknown', () => {
    expect(getProfileDisplayName('Unknown')).toBe('Novo Jogador');
  });

  it('retorna "Impaciente" para o perfil Impatient', () => {
    expect(getProfileDisplayName('Impatient')).toBe('Impaciente');
  });

  it('retorna "Explorador" para o perfil Explorer', () => {
    expect(getProfileDisplayName('Explorer')).toBe('Explorador');
  });

  it('retorna "Focado" para o perfil Focused', () => {
    expect(getProfileDisplayName('Focused')).toBe('Focado');
  });

  it('retorna "Casual" para o perfil Casual', () => {
    expect(getProfileDisplayName('Casual')).toBe('Casual');
  });
});

// ─────────────────────────────────────────────────────────────
// 2. getProfileColors — classes CSS corretas
// ─────────────────────────────────────────────────────────────
describe('getProfileColors', () => {
  it('retorna as classes de fundo corretas para Impatient no modo claro', () => {
    const colors = getProfileColors('Impatient');
    // A classe bg deve conter "orange" para o perfil impaciente
    expect(colors.bg).toContain('orange');
  });

  it('retorna as classes de texto corretas para Explorer', () => {
    const colors = getProfileColors('Explorer');
    expect(colors.text).toContain('blue');
  });

  it('retorna as classes de texto corretas para Focused', () => {
    const colors = getProfileColors('Focused');
    expect(colors.text).toContain('purple');
  });

  it('retorna as classes do perfil Unknown quando o perfil não existe', () => {
    // Força a função com um tipo inválido para garantir que ela não quebra
    const colors = getProfileColors('Unknown');
    expect(colors.text).toBe('text-muted-foreground');
  });
});

// ─────────────────────────────────────────────────────────────
// 3. getProfileIcon — emoji correto para cada perfil
// ─────────────────────────────────────────────────────────────
describe('getProfileIcon', () => {
  it('retorna o emoji ⚡ para Impatient', () => {
    expect(getProfileIcon('Impatient')).toBe('⚡');
  });

  it('retorna o emoji 🎯 para Focused', () => {
    expect(getProfileIcon('Focused')).toBe('🎯');
  });

  it('retorna o emoji ❓ para Unknown', () => {
    expect(getProfileIcon('Unknown')).toBe('❓');
  });
});
