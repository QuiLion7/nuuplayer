<script lang="ts">
  import { page } from '$app/state';
  import { onMount, onDestroy } from 'svelte';
  import { resolve } from '$app/paths';
  import { listGames } from '$lib/data/list-games';
  import { uiAdaptation } from '$lib/stores/ui';
  import { trackGameStart, trackGameEnd } from '$lib/tracking/tracker';
  import { cn } from '$lib/utils';
  import GameCard from '$lib/components/common/game-card.svelte';
  import GameBadge from '$lib/components/common/game-badge.svelte';
  import { Button } from '$lib/components/ui/button';
  
  // Jogos internos
  import Snake from '$lib/games/snake.svelte';
  import MemoryMatch from '$lib/games/memory-match.svelte';
  import Minesweeper from '$lib/games/minesweeper.svelte';

  import type { GameInterface } from '$lib/types';
  
  let gameId = $derived(page.params.id);
  let game = $derived(listGames.find((g) => g.id === gameId));
  let suggestions = $derived(
    $uiAdaptation.showSuggestions && game
      ? (game.isSimilarTo ?? [])
          .map((id) => listGames.find((g) => g.id === id))
          .filter((g): g is GameInterface => g != null)
      : []
  );
  let hasSuggestions = $derived(suggestions.length > 0);
  let gameActive = $state(false);
  let timeElapsed = $state(0);
  let intervalId: ReturnType<typeof setInterval>;

  // Formata tempo em formato legível
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  }

  // Manipula interações no jogo para tracking
  function handleGameInteraction(): void {
    // Interações são automaticamente rastreadas pelo sistema global
  }

  onMount(() => {
    if (game) {
      trackGameStart(game.id);
      gameActive = true;
      intervalId = setInterval(() => {
        timeElapsed++;
      }, 1000);
    }
  });

  onDestroy(() => {
    if (game && gameActive) {
      trackGameEnd(game.id);
    }
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
</script>

<svelte:head>
  {#if game}
    <title>{game.title} — NuuPlayer</title>
    <meta name="description" content={game.description} />
  {:else}
    <title>Jogo não encontrado — NuuPlayer</title>
  {/if}
</svelte:head>

{#if game}
  <div class="pb-12 px-6 py-4" id="game-page-{game.id}">
    <!-- Header com botão de voltar -->
    <div class="mb-6">
      <Button 
        variant="outline" 
        href={resolve('/')} 
        class="mb-4 gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Voltar à página inicial
      </Button>

      <div 
        class="relative rounded-md overflow-hidden py-10 px-8" 
        style="background: {game.coverColor};"
      >
        <div class="relative z-10 flex items-center gap-6">
          <span class="text-6xl drop-shadow-lg" aria-hidden="true">
            {game.icon}
          </span>
          <div class="flex-1">
            <h1 class="text-3xl font-extrabold tracking-tight text-white mb-2 drop-shadow-md">
              {game.title}
            </h1>
            <div class="flex gap-3 items-center flex-wrap">
              <GameBadge variant="category" class="bg-black/35 text-white/90 border-muted-foreground">
                {game.category}
              </GameBadge>
              <span class="text-sm text-white/80 font-medium drop-shadow-sm flex items-center gap-1">
                🕐 {game.durationEstimate}
              </span>
            </div>
          </div>
        </div>
        <div class="absolute inset-0 bg-linear-to-r from-black/20 to-transparent"></div>
      </div>
    </div>

    <div class={cn(
      'grid items-start gap-8',
      hasSuggestions 
        ? 'grid-cols-1 lg:grid-cols-[1fr_280px]' 
        : 'grid-cols-1'
    )}>
      <!-- Área principal do jogo -->
      <div class="flex flex-col gap-5 min-w-0">
        <p class="text-base text-muted-foreground leading-relaxed">
          {game.description}
        </p>

        <!-- Container do jogo -->
        <div 
          class="bg-card border border-border shadow-sm rounded-md p-5 flex flex-col gap-4 w-full transition-colors duration-300" 
          aria-label="Área do jogo"
          onclick={handleGameInteraction} 
          onkeydown={handleGameInteraction} 
          role="presentation"
        >
          <!-- Status da sessão -->
          <div class="flex justify-between text-sm text-muted-foreground font-medium px-2">
            <span class="flex items-center gap-1">
              ⏱ Sessão: {formatTime(timeElapsed)}
            </span>
            <span class="text-primary">
              Interaja na área do jogo!
            </span>
          </div>

          <!-- Frame do jogo -->
          <div class="w-full rounded-md overflow-hidden relative bg-black flex justify-center border border-border">
            {#if game.internal}
              {#if game.id === 'svelte-snake'}
                <Snake />
              {:else if game.id === 'svelte-memory'}
                <MemoryMatch />
              {:else if game.id === 'minesweeper'}
                <Minesweeper />
              {:else}
                <div class="w-full h-96 flex items-center justify-center text-white">
                  <p>Jogo interno não encontrado: {game.title}</p>
                </div>
              {/if}
            {:else if game.url}
              <iframe 
                src={game.url} 
                title={game.title} 
                class="w-full border-none block" 
                style="height: {game.iframeHeight ?? 600}px;"
                allowfullscreen
                loading="lazy"
              ></iframe>
            {:else}
              <div class="w-full h-96 flex items-center justify-center text-white">
                <p>Jogo não configurado</p>
              </div>
            {/if}
          </div>
        </div>

        <!-- Tags do jogo -->
        <div class="flex flex-wrap gap-2">
          {#each game.tags as tag (tag)}
            <GameBadge>{tag}</GameBadge>
          {/each}
        </div>
      </div>

      <!-- Sidebar com sugestões -->
      {#if suggestions.length > 0}
        <aside class="shrink-0" aria-label="Jogos sugeridos">
          <h2 class="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Você também pode gostar
          </h2>
          <div class="flex flex-col gap-3">
            {#each suggestions as suggestion (suggestion.id)}
              <GameCard game={suggestion} />
            {/each}
          </div>
        </aside>
      {/if}
    </div>
  </div>

{:else}
  <!-- Página de erro 404 -->
  <div class="text-center py-16 px-8 flex flex-col items-center gap-4">
    <h1 class="text-3xl font-extrabold text-foreground" aria-live="assertive">
      🕹️ Jogo não encontrado
    </h1>
    <p class="text-muted-foreground">
      O jogo que você procura não existe.
    </p>
    <Button href={resolve('/')}>
      Voltar ao catálogo
    </Button>
  </div>
{/if}
