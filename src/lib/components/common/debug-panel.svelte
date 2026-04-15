<script lang="ts">
  import { profile } from "$lib/stores/profile";
  import {
    session,
    quickExitsCount,
    uniqueGamesVisited,
    maxTimeInGame,
    avgSessionDuration,
  } from "$lib/stores/session";
  import { uiAdaptation, debugOpen } from "$lib/stores/ui";
  import { nextThreshold } from "$lib/stores/profile";
  import { getProfileColors, getProfileDisplayName } from '$lib/utils/profileColors';
  import { cn } from '$lib/utils';
  import { Badge } from '$lib/components/ui/badge';
  import Button from "../ui/button/button.svelte";
  import * as Sheet from "$lib/components/ui/sheet";
	import { toast } from "svelte-sonner";

  function resetSession() {
    toast.success("Sessão resetada")
    session.reset();
  }

  // Matriz de métricas derivadas
  const metrics = $derived([
    { label: "Sessões", value: $session.sessions.length },
    { label: "Saídas rápidas", value: $quickExitsCount },
    { label: "Jogos únicos", value: $uniqueGamesVisited },
    { label: "Max tempo", value: `${Math.round($maxTimeInGame)}s` },
    { label: "Média sessão", value: `${Math.round($avgSessionDuration)}s` },
    { label: "Rolagem da página", value: `${$session.scrollDepth}%` },
    { label: "Cliques", value: $session.totalClicks },
    { label: "Teclado", value: $session.keyboardHits || 0 },
  ]);

  let profileColors = $derived(getProfileColors($profile.type));
  let displayName = $derived(getProfileDisplayName($profile.type));

  const SECTION_TITLE_CLASS = "uppercase tracking-wider text-muted-foreground font-semibold text-xs m-0 mb-2.5 transition-colors duration-300";
  const SECTION_BORDER_CLASS = "py-3.5 px-5 border-b border-border transition-colors duration-300";
</script>

<Sheet.Root bind:open={$debugOpen}>
  <Sheet.Content 
    side="right" 
    class="w-full sm:max-w-[400px] p-0 flex flex-col transition-colors duration-300 border-l border-border bg-background/95 backdrop-blur-[20px]"
  >
    <Sheet.Header class="py-4 px-5 border-b border-border shrink-0 text-left flex justify-between items-center">
      <Sheet.Title class="w-full font-bold text-base text-foreground transition-colors duration-300">
        🔬 NuuPlayer Debug
      </Sheet.Title>
    </Sheet.Header>

    <div class="flex-1 overflow-y-auto flex flex-col">
      <!-- Profile Section -->
      <section class={SECTION_BORDER_CLASS}>
        <h4 class={SECTION_TITLE_CLASS}>Perfil Atual</h4>
        <Badge
          variant="secondary"
          class={cn(
            'gap-2 py-3 px-2.5 mb-2 transition-colors duration-300',
            profileColors.bg,
            profileColors.border,
            profileColors.text
          )}
        >
          <span class="text-base">{profileColors.icon}</span>
          <strong class="font-semibold">{displayName}</strong>
          <span class="text-xs opacity-70">{Math.round($profile.confidence * 100)}% confiança</span>
        </Badge>
        <p class="m-0 text-muted-foreground leading-relaxed text-sm transition-colors duration-300">
          {$profile.reason}
        </p>
      </section>

      <!-- Metrics Section -->
      <section class={SECTION_BORDER_CLASS}>
        <h4 class={SECTION_TITLE_CLASS}>Métricas da Sessão</h4>
        <div class="grid grid-cols-4 gap-2">
          {#each metrics as metric (metric.label)}
            <div class="flex flex-col items-center bg-secondary/50 rounded-md py-2 px-1 border border-border transition-colors duration-300">
              <span class="text-lg font-bold text-foreground leading-tight">{metric.value}</span>
              <span class="text-xs text-muted-foreground text-center mt-0.5">{metric.label}</span>
            </div>
          {/each}
        </div>
      </section>

      <!-- Threshold Section -->
      <section class={SECTION_BORDER_CLASS}>
        <h4 class={SECTION_TITLE_CLASS}>Próximo Threshold</h4>
        <pre class="font-mono text-xs text-accent-foreground bg-secondary/50 rounded-md py-2.5 px-3 m-0 whitespace-pre-wrap leading-relaxed transition-colors duration-300">{$nextThreshold}</pre>
      </section>

      <!-- Adaptation Section -->
      <section class="py-3.5 px-5 pb-6 transition-colors duration-300">
        <h4 class={SECTION_TITLE_CLASS}>Adaptação Ativa</h4>
        <p class="text-xs text-muted-foreground m-0 mb-2 transition-colors duration-300">
          Categorias prioritárias:
        </p>
        <div class="flex flex-wrap gap-1">
          {#each $uiAdaptation.priorityCategories as cat (cat)}
            <Badge variant="secondary" class="text-xs">
              {cat}
            </Badge>
          {/each}
          {#if $uiAdaptation.priorityCategories.length === 0}
            <Badge variant="outline" class="text-xs">
              Nenhuma
            </Badge>
          {/if}
        </div>
      </section>
    </div>

    <!-- Footer Action -->
    <Sheet.Footer class="py-3 px-5 shrink-0 border-t border-border transition-colors duration-300">
      <Button
        variant="destructive"
        class="w-full rounded-md"
        onclick={resetSession}
        id="debug-reset-btn"
      >
        🔄 Resetar Sessão
      </Button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>

