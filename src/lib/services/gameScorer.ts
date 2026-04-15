import type { GameInterface, ProfileType } from '$lib/types';

// Configuração de scoring para cada tipo de perfil
interface ScoringConfig {
  priorityCategories: string[];
  priorityTags: string[];
  categoryWeight: number;
  tagWeight: number;
  specialRules: Record<string, number>;
}

// Mapeamento de configurações de scoring por perfil
const SCORING_CONFIGS: Record<ProfileType, ScoringConfig> = {
  Unknown: {
    priorityCategories: [],
    priorityTags: [],
    categoryWeight: 0,
    tagWeight: 0,
    specialRules: {}
  },
  Impatient: {
    priorityCategories: ['arcade', 'casual'],
    priorityTags: ['quick', 'fast', 'reflex'],
    categoryWeight: 10,
    tagWeight: 5,
    specialRules: { isFast: 8 }
  },
  Explorer: {
    priorityCategories: ['puzzle', 'strategy', 'quiz'],
    priorityTags: ['new', 'variety'],
    categoryWeight: 10,
    tagWeight: 5,
    specialRules: { isNew: 8 }
  },
  Focused: {
    priorityCategories: ['puzzle', 'strategy'],
    priorityTags: ['focused', 'logic', 'strategy'],
    categoryWeight: 10,
    tagWeight: 5,
    specialRules: {}
  },
  Casual: {
    priorityCategories: ['casual'],
    priorityTags: ['relaxing', 'casual', 'zen'],
    categoryWeight: 10,
    tagWeight: 5,
    specialRules: {}
  }
};

// Serviço responsável por calcular scores e reordenar jogos baseado no perfil do usuário
export class GameScorer {
  // Calcula o score de um jogo específico para um perfil
  scoreGame(game: GameInterface, profileType: ProfileType): number {
    const config = SCORING_CONFIGS[profileType];

    let score = 0;

    // Score por categoria prioritária
    if (config.priorityCategories.includes(game.category)) {
      score += config.categoryWeight;
    }

    // Score por tags prioritárias
    for (const tag of game.tags) {
      if (config.priorityTags.includes(tag)) {
        score += config.tagWeight;
      }
    }

    // Regras especiais baseadas no perfil
    for (const [rule, weight] of Object.entries(config.specialRules)) {
      if (game[rule as keyof GameInterface] === true) {
        score += weight;
      }
    }

    return score;
  }

  // Reordena uma lista de jogos baseado no perfil do usuário
  reorderGames(games: GameInterface[], profileType: ProfileType): GameInterface[] {
    const scoredGames = games.map(game => ({
      game,
      score: this.scoreGame(game, profileType)
    }));

    return scoredGames
      .sort((a, b) => b.score - a.score)
      .map(item => item.game);
  }

  // Retorna apenas os IDs dos jogos reordenados
  reorderGameIds(games: GameInterface[], profileType: ProfileType): string[] {
    return this.reorderGames(games, profileType).map(game => game.id);
  }

  // Verifica se um jogo é prioritário para um perfil
  isGamePriority(game: GameInterface, profileType: ProfileType): boolean {
    const config = SCORING_CONFIGS[profileType];
    
    return config.priorityCategories.includes(game.category) || game.tags.some(tag => 
      config.priorityTags.includes(tag)
    );
  }
}

// Instância singleton para uso na aplicação
export const gameScorer = new GameScorer();