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
  import Button from "../ui/button/button.svelte";

  function resetSession() {
    session.reset();
  }

  // Derived metrics array to solve repetition
  const metrics = $derived([
    { label: "Sessões", value: $session.sessions.length },
    { label: "Quick Exits", value: $quickExitsCount },
    { label: "Jogos únicos", value: $uniqueGamesVisited },
    { label: "Max tempo", value: `${Math.round($maxTimeInGame)}s` },
    { label: "Média sessão", value: `${Math.round($avgSessionDuration)}s` },
    { label: "Scroll depth", value: `${$session.scrollDepth}%` },
    { label: "Cliques", value: $session.totalClicks },
    { label: "Teclado", value: $session.keyboardHits || 0 },
  ]);

  const SECTION_TITLE_CLASS = "uppercase tracking-[0.08em] text-muted-foreground font-semibold text-[0.72rem] m-0 mb-2.5 transition-colors duration-300";
  const SECTION_BORDER_CLASS = "py-3.5 px-5 border-b border-border transition-colors duration-300";
</script>

{#if $debugOpen}
  <aside
    class="fixed top-4 right-4 bottom-4 w-[400px] bg-background/95 border border-border rounded-sm flex flex-col z-[1000] backdrop-blur-[20px] shadow-xl animate-[slideIn_0.3s_cubic-bezier(.22,.68,0,1.2)] text-[0.82rem] transition-colors duration-300"
    id="debug-panel"
    aria-label="Debug Panel"
  >
    <!-- Header -->
    <div class="flex justify-between items-center py-4 px-5 border-b border-border shrink-0 transition-colors duration-300">
      <span class="font-bold text-[0.9rem] text-foreground transition-colors duration-300">
        🔬 NuuPlayer Debug
      </span>
      <Button 
        variant="ghost" 
        size="icon" 
        class="h-7 w-7 opacity-50 hover:opacity-100"
        aria-label="Fechar painel de debug"
        onclick={() => debugOpen.set(false)}> 
        ✕
      </Button>
    </div>

    <div class="flex-1 overflow-y-auto flex flex-col">
      <!-- Profile Section -->
      <section class={SECTION_BORDER_CLASS}>
        <h4 class={SECTION_TITLE_CLASS}>Perfil Atual</h4>
        <div
          class="inline-flex items-center gap-2 py-1.5 px-3 rounded-sm bg-primary/10 border border-primary/20 mb-2 text-primary dark:text-primary-foreground transition-colors duration-300"
        >
          <strong>{$profile.type === "Unknown" ? "Novo Jogador" : $profile.type}</strong>
          <span class="text-[0.7rem] opacity-70">{Math.round($profile.confidence * 100)}% confiança</span>
        </div>
        <p class="m-0 text-muted-foreground leading-relaxed text-[0.78rem] transition-colors duration-300">
          {$profile.reason}
        </p>
      </section>

      <!-- Metrics Section -->
      <section class={SECTION_BORDER_CLASS}>
        <h4 class={SECTION_TITLE_CLASS}>Métricas da Sessão</h4>
        <div class="grid grid-cols-4 gap-2">
          {#each metrics as metric (metric.label)}
            <div class="flex flex-col items-center bg-muted/30 rounded-sm py-2 px-1 border border-border transition-colors duration-300">
              <span class="text-[1.1rem] font-bold text-foreground leading-tight">{metric.value}</span>
              <span class="text-[0.62rem] text-muted-foreground text-center mt-0.5">{metric.label}</span>
            </div>
          {/each}
        </div>
      </section>

      <!-- Threshold Section -->
      <section class={SECTION_BORDER_CLASS}>
        <h4 class={SECTION_TITLE_CLASS}>Próximo Threshold</h4>
        <pre class="font-mono text-[0.72rem] text-sky-600 dark:text-sky-400 bg-muted/50 rounded-sm py-2.5 px-3 m-0 whitespace-pre-wrap leading-relaxed transition-colors duration-300">{$nextThreshold}</pre>
      </section>

      <!-- Adaptation Section -->
      <section class="py-3.5 px-5 pb-6 transition-colors duration-300">
        <h4 class={SECTION_TITLE_CLASS}>Adaptação Ativa</h4>
        <p class="text-[0.72rem] text-muted-foreground m-0 mb-2 transition-colors duration-300">
          Categorias prioritárias:
        </p>
        <div class="flex flex-wrap gap-1">
          {#each $uiAdaptation.priorityCategories as cat (cat)}
            <span class="text-[0.68rem] py-1 px-2.5 rounded-sm bg-primary/10 border border-primary/20 text-primary dark:text-primary-foreground transition-colors duration-300">
              {cat}
            </span>
          {/each}
          {#if $uiAdaptation.priorityCategories.length === 0}
            <span class="text-[0.68rem] py-1 px-2.5 rounded-sm bg-muted border border-border text-muted-foreground transition-colors duration-300">
              Nenhuma
            </span>
          {/if}
        </div>
      </section>
    </div>

    <!-- Footer Action -->
    <div class="py-3 px-5 shrink-0 border-t border-border transition-colors duration-300">
      <Button
        variant="destructive"
        class="w-full rounded-sm"
        onclick={resetSession}
        id="debug-reset-btn"
      >
        🔄 Resetar Sessão
      </Button>
    </div>
  </aside>
{/if}
