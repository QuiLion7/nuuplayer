<script lang="ts">
  import { uiAdaptation } from '$lib/stores/ui';
  import { cn } from '$lib/utils';

  interface Props {
    class?: string;
  }

  let { class: className = '' }: Props = $props();
</script>

<div 
  class={cn(
    'relative overflow-hidden rounded-md p-0.5',
    'bg-linear-to-br from-border/50 to-transparent',
    'border border-border mb-8 transition-colors duration-300',
    className
  )}
  style="--profile-type: '{$uiAdaptation.profileType}';"
>
  <!-- Conteúdo principal -->
  <div class="flex items-center gap-5 py-6 px-8 bg-card/90 backdrop-blur-md rounded-[calc(0.75rem-2px)] relative z-10 transition-colors duration-300">
    <!-- Emoji animado -->
    <div class="text-5xl leading-none drop-shadow-sm animate-[float_3s_ease-in-out_infinite]">
      {$uiAdaptation.bannerEmoji}
    </div>
    
    <!-- Texto -->
    <div class="flex-1">
      <h2 class="text-xl font-bold mb-1 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent transition-colors duration-300">
        {$uiAdaptation.bannerMessage}
      </h2>
      <p class="text-sm text-muted-foreground leading-relaxed transition-colors duration-300">
        {$uiAdaptation.bannerSubtext}
      </p>
    </div>
  </div>
  
  <!-- Background decorativo -->
  <div 
    class="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,hsl(var(--primary)/0.08),transparent_60%),radial-gradient(ellipse_at_80%_50%,hsl(var(--accent)/0.05),transparent_60%)] pointer-events-none transition-colors duration-300" 
    aria-hidden="true"
  ></div>
</div>

<style>
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
</style>
