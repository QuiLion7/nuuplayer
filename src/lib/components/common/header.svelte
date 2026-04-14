<script lang="ts">
	import { resolve } from '$app/paths';
	import ModeToggle from '../mode-toggle.svelte';
  import ProfileBadge from './profile-badge.svelte';
	import Button from '../ui/button/button.svelte';
	import { debugOpen } from '$lib/stores/ui';
</script>

<header class="sticky top-0 z-[900] flex justify-between items-center py-3.5 px-8 max-sm:px-4 bg-sidebar backdrop-blur-[20px] border-b border-black/5 dark:border-white/5 transition-colors duration-300">

  <a href="{resolve('/')}" class="flex items-center gap-2.5 rounded-lg py-1 px-1.5 -m-1" id="wordmark-link" aria-label="NuuPlayer — Página inicial">
    <span class="text-[1.4rem]" aria-hidden="true">🎮</span>
    <span class="text-xl font-extrabold tracking-[-0.02em] text-primary transition-colors duration-300">Nuu<span class="text-sky-600">Player</span></span>
  </a>
  
  <nav class="flex items-center justify-center gap-3" aria-label="Controles globais">
    <ProfileBadge />
    
    <ModeToggle />

    <Button
      variant="outline"
      size="icon"
      title="Painel de debug (atalho: D)"
      onclick={() => debugOpen.update((v) => !v)}
      aria-expanded={$debugOpen}
      aria-controls="debug-panel"
    >
      🔬
    </Button>
  </nav>
</header>