import { derived, writable } from 'svelte/store';
import { profile } from './profile';
import { listGames } from '$lib/data/list-games';
import { gameScorer } from '$lib/services/gameScorer';
import type { UIAdaptation, ProfileType } from '$lib/types';

// Configuração de UI por tipo de perfil
const adaptationMap: Record<ProfileType, Omit<UIAdaptation, 'profileType' | 'gameOrder'>> = {
  Unknown: {
    bannerMessage: 'Bem-vindo ao NuuPlayer',
    bannerSubtext: 'Explore jogos e descubriremos o que você mais gosta.',
    bannerEmoji: '🎮',
    priorityTags: [],
    priorityCategories: [],
    highlightNew: true,
    showSuggestions: false,
  },
  Impatient: {
    bannerMessage: 'Rápido? Você vai adorar isso.',
    bannerSubtext: 'Selecionamos os melhores jogos que cabem na sua agenda.',
    bannerEmoji: '⚡',
    priorityTags: ['quick', 'fast', 'reflex'],
    priorityCategories: ['arcade', 'casual'],
    highlightNew: false,
    showSuggestions: true,
  },
  Explorer: {
    bannerMessage: 'Você adora descobrir coisas novas!',
    bannerSubtext: 'Separamos as novidades e surpresas para você.',
    bannerEmoji: '🔭',
    priorityTags: ['new', 'variety'],
    priorityCategories: ['puzzle', 'strategy', 'quiz'],
    highlightNew: true,
    showSuggestions: true,
  },
  Focused: {
    bannerMessage: 'Você curte profundidade.',
    bannerSubtext: 'Jogos que vão te desafiar de verdade, selecionados para você.',
    bannerEmoji: '🎯',
    priorityTags: ['focused', 'logic', 'strategy'],
    priorityCategories: ['puzzle', 'strategy'],
    highlightNew: false,
    showSuggestions: true,
  },
  Casual: {
    bannerMessage: 'Simples, rápido e divertido.',
    bannerSubtext: 'Nada complicado. Só boas vibes.',
    bannerEmoji: '😎',
    priorityTags: ['relaxing', 'casual', 'zen'],
    priorityCategories: ['casual'],
    highlightNew: false,
    showSuggestions: false,
  },
};

// Store derivado que adapta a UI baseado no perfil do usuário
export const uiAdaptation = derived(profile, ($profile): UIAdaptation => {
  const config = adaptationMap[$profile.type];

  return {
    ...config,
    profileType: $profile.type,
    gameOrder: gameScorer.reorderGameIds(listGames, $profile.type),
  };
});

// Debug panel visibility
export const debugOpen = writable(false);
