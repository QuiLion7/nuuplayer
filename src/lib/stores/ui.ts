import { derived, writable } from 'svelte/store';
import { profile } from './profile';
import { games } from '$lib/data/list-games';
import type { UIAdaptation, ProfileType } from '$lib/types';

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

function reorderGameIds(profileType: ProfileType): string[] {
  const config = adaptationMap[profileType];
  const priorityCats = config.priorityCategories;
  const priorityTags = config.priorityTags;

  const scored = games.map((g) => {
    let score = 0;

    if (priorityCats.includes(g.category)) score += 10;

    for (const tag of g.tags) {
      if (priorityTags.includes(tag)) score += 5;
    }

    if (profileType === 'Impatient' && g.isFast) score += 8;
    if (profileType === 'Explorer' && g.isNew) score += 8;

    return { id: g.id, score };
  });

  return scored.sort((a, b) => b.score - a.score).map((g) => g.id);
}

export const uiAdaptation = derived(profile, ($profile): UIAdaptation => {
  const config = adaptationMap[$profile.type];

  return {
    ...config,
    profileType: $profile.type,
    gameOrder: reorderGameIds($profile.type),
  };
});

// Debug panel visibility
export const debugOpen = writable(false);
