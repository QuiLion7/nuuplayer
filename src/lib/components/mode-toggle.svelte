<script lang="ts"> 
 import { toggleMode, mode } from "mode-watcher";
 import { Button } from "$lib/components/ui/button/index.js";
</script>
 
<Button onclick={toggleMode} variant="outline" size="icon">
  {#if mode.current === 'dark'}
  🌙
  {:else}
  ☀️
  {/if}
</Button>