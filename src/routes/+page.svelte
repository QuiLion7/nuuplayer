<script lang="ts">
  import AdaptiveBanner from '$lib/components/common/adaptive-banner.svelte';
  import GameGrid from '$lib/components/common/game-grid.svelte';
  import { Badge } from '$lib/components/ui/badge';
  import { profile } from '$lib/stores/profile';
  import { uiAdaptation } from '$lib/stores/ui';

  // Mapeia tipos de perfil para títulos personalizados
  const profileTitles = {
    Unknown: 'Todos os Jogos',
    Impatient: '⚡ Jogos Rápidos para Você',
    Explorer: '🔭 Explore o Catálogo',
    Focused: '🎯 Feito para Você ir Fundo',
    Casual: '😎 Seus Favoritos'
  } as const;
</script>

<svelte:head>
	<title>NuuPlayer</title>
	<meta name="description" content="Descubra jogos selecionados especialmente para o seu estilo de jogo." />
</svelte:head>

<section class="pb-12 px-6 py-4" id="home-page">
  <AdaptiveBanner />

  <div class="flex items-baseline justify-between flex-wrap gap-3 mb-5">
    <h1 class="text-2xl font-extrabold tracking-tight text-foreground transition-colors duration-300">
      {profileTitles[$profile.type]}
    </h1>
    
    {#if $uiAdaptation?.priorityCategories?.length > 0}
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          Priorizando:
        </span>
        {#each $uiAdaptation.priorityCategories as category (category)}
          <Badge variant="default" class="bg-primary/10 text-primary border-primary/20">
            {category}
          </Badge>
        {/each}
      </div>
    {/if}
  </div>

  <GameGrid />
</section>
