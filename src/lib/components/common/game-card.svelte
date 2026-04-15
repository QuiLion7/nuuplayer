<script lang="ts">
  import type { GameInterface } from '$lib/types';
  import { uiAdaptation } from '$lib/stores/ui';
  import { gameScorer } from '$lib/services/gameScorer';
  import { resolve } from '$app/paths';
  import { cn } from '$lib/utils';
  import GameBadge from './game-badge.svelte';

  interface Props {
    game: GameInterface;
    isSelected?: boolean;
    class?: string;
  }

  let { 
    game, 
    isSelected = false,
    class: className = ''
  }: Props = $props();

  let isPriority = $derived(
    gameScorer.isGamePriority(game, $uiAdaptation.profileType)
  );
    
  let showNew = $derived($uiAdaptation.highlightNew && game.isNew);

  // Manipulação das teclas de atalho no card
  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') {
      e.preventDefault();
      (e.currentTarget as HTMLAnchorElement).click();
    }
  }
</script>

<a 
  href={resolve('/game/[id]', { id: game.id })} 
  class={cn(
    'group relative flex flex-col rounded-md overflow-hidden',
    'bg-card hover:bg-accent/50 border border-border',
    'no-underline text-card-foreground transition-all cursor-pointer',
    'hover:-translate-y-1.5 hover:scale-[1.02]',
    'hover:shadow-lg dark:hover:shadow-xl',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    isPriority && [
      'border-primary/50 shadow-sm',
      'hover:border-primary hover:shadow-primary/20'
    ],
    isSelected && 'ring-2 ring-primary',
    className
  )}
  id="game-card-{game.id}"
  tabindex="-1"
  onkeydown={handleKeydown}
>
  <div 
    class="relative h-36 flex items-center justify-center p-2" 
    style="background: {game.coverColor};"
  >
    <span class="text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-2">
      {game.icon}
    </span>
    
    <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
      {#if showNew}
        <GameBadge variant="new">✨ Novo</GameBadge>
      {/if}
      {#if game.isFast}
        <GameBadge variant="fast">⚡ Rápido</GameBadge>
      {/if}
      {#if isPriority}
        <GameBadge variant="priority">⭐ Destaque</GameBadge>
      {/if}
    </div>
  </div>

  <div class="flex flex-col gap-2.5 p-4 flex-1">
    <div class="flex justify-between items-start gap-2">
      <h3 class="text-base font-bold leading-tight">{game.title}</h3>
      <GameBadge variant="category">{game.category}</GameBadge>
    </div>
    
    <p class="text-sm text-muted-foreground leading-snug line-clamp-2">
      {game.description}
    </p>
    
    <div class="flex justify-between items-center mt-auto">
      <span class="text-xs text-muted-foreground flex items-center gap-1">
        🕐 {game.durationEstimate}
      </span>
      <div class="flex gap-1">
        {#each game.tags.slice(0, 2) as tag (tag)}
          <GameBadge>{tag}</GameBadge>
        {/each}
      </div>
    </div>
  </div>

  <!-- Overlay de hover -->
  <div 
    class="absolute inset-0 bg-linear-to-br from-background/5 to-50% to-transparent pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100" 
    aria-hidden="true"
  ></div>
</a>
