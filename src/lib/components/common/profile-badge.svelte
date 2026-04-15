<script lang="ts">
  import { profile } from '$lib/stores/profile';
  import { getProfileColors, getProfileDisplayName } from '$lib/utils/profileColors';
  import { cn } from '$lib/utils';

  let profileColors = $derived(getProfileColors($profile.type));
  let displayName = $derived(getProfileDisplayName($profile.type));
</script>

<span
  class={cn(
    'inline-flex items-center h-9 gap-1.5 px-3.5 text-sm font-medium rounded-md border backdrop-blur-md transition-all duration-300',
    profileColors.bg,
    profileColors.border,
    profileColors.text
  )}
  title={$profile.reason}
>
  <span class="text-base leading-none">{profileColors.icon}</span>
  <span class="leading-none">{displayName}</span>
  {#if $profile.type !== 'Unknown'}
    <span class="text-xs opacity-70 ml-1 leading-none">
      {Math.round($profile.confidence * 100)}%
    </span>
  {/if}
</span>
