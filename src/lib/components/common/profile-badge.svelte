<script lang="ts">
  import { profile } from '$lib/stores/profile';

  const profileColors: Record<string, string> = {
    Unknown:   'rgba(120,120,140,0.25)',
    Impatient: 'rgba(255, 87, 34, 0.3)',
    Explorer:  'rgba(33, 150, 243, 0.3)',
    Focused:   'rgba(103, 58, 183, 0.3)',
    Casual:    'rgba(76, 175, 80, 0.3)',
  };

  const profileIcons: Record<string, string> = {
    Unknown:   '❓',
    Impatient: '⚡',
    Explorer:  '🔭',
    Focused:   '🎯',
    Casual:    '😎',
  };

  let color = $derived(profileColors[$profile.type] ?? profileColors.Unknown);
  let icon = $derived(profileIcons[$profile.type] ?? '❓');
</script>

<div class="h-9 inline-flex items-center gap-1.5 px-3.5 rounded-sm border border-black/10 dark:border-white/10 text-[0.8rem] font-semibold tracking-[0.03em] backdrop-blur-md transition-colors duration-400 ease-in-out text-slate-900 dark:text-white" style="background-color: {color};" title={$profile.reason}>
  <span class="text-[0.9rem] leading-none">{icon}</span>
  <span class="leading-none text-card-foreground">{$profile.type === 'Unknown' ? 'Novo Jogador' : $profile.type}</span>
  {#if $profile.type !== 'Unknown'}
    <span class="text-[0.7rem] opacity-70 ml-0.5 leading-none">{Math.round($profile.confidence * 100)}%</span>
  {/if}
</div>
