<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { listGames } from '$lib/data/list-games';
  import { uiAdaptation } from '$lib/stores/ui';
  import GameCard from './game-card.svelte';
  import type { GameInterface } from '$lib/types';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();

  let orderedGames = $derived(
    ($uiAdaptation?.gameOrder || [])
      .map((id: string) => listGames?.find((g) => g.id === id))
      .filter((game): game is GameInterface => game != null)
  );

  let selectedIndex = $state(0);

  // Calcula o número de colunas do grid baseado no CSS
  function getColumns(): number {
    if (typeof document === 'undefined') return 1;
    const grid = document.getElementById('game-grid');
    if (!grid) return 1;
    
    const style = window.getComputedStyle(grid);
    const columns = style.gridTemplateColumns.split(' ').length;
    return Math.max(1, columns);
  }

  // Manipula a navegação por teclado no grid
  function handleKeydown(e: KeyboardEvent): void {
    if (orderedGames.length === 0) return;

    const target = e.target as HTMLElement;
    const tag = target?.tagName;
    
    // Ignora se estiver em campos de input
    if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) {
      return;
    }

    const cols = getColumns();
    const maxIndex = orderedGames.length - 1;

    let newIndex = selectedIndex;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = Math.min(newIndex + 1, maxIndex);
        e.preventDefault();
        break;
      case 'ArrowLeft':
        newIndex = Math.max(newIndex - 1, 0);
        e.preventDefault();
        break;
      case 'ArrowDown':
        newIndex = Math.min(newIndex + cols, maxIndex);
        e.preventDefault();
        break;
      case 'ArrowUp':
        newIndex = Math.max(newIndex - cols, 0);
        e.preventDefault();
        break;
      case 'Tab':
        e.preventDefault();
        break;
    }

    if (newIndex !== selectedIndex) {
      selectedIndex = newIndex;
      focusSelected();
    } else if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      focusSelected();
    }
  }

  // Foca no item selecionado
  function focusSelected(): void {
    if (orderedGames.length === 0) return;
    
    const element = document.querySelector(`#game-grid [data-grid-index="${selectedIndex}"]`) as HTMLElement;

    element?.focus();
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    // Pequeno delay para assegurar a renderização do DOM
    setTimeout(focusSelected, 50);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

{#if orderedGames && orderedGames.length > 0}
  <div 
    id="game-grid"
    class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 {className}"
  >
    {#each orderedGames as game, index (game.id)}
      <div data-grid-index={index}>
        <GameCard {game} isSelected={selectedIndex === index} />
      </div>
    {/each}
  </div>
{:else}
  <div class="flex items-center justify-center h-32 text-muted-foreground">
    <p>Nenhum jogo encontrado</p>
  </div>
{/if}
