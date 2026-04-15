<script lang="ts">
  import { Badge, type BadgeVariant } from '$lib/components/ui/badge';

  interface Props {
    variant?: BadgeVariant | 'priority' | 'new' | 'fast' | 'category';
    class?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: any;
  }

  let {
    variant = 'default',
    class: className = '',
    children
  }: Props = $props();

  const variantMap: Record<string, BadgeVariant> = {
    priority: 'default',
    new: 'secondary', 
    fast: 'secondary',
    category: 'outline',
    default: 'secondary'
  };

  const customClasses: Record<string, string> = {
    priority: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    new: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800/50',
    fast: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800/50',
    category: 'border-blue-200 bg-blue-600 text-blue-300 border-blue-400/50'
  };

  let mappedVariant = $derived(variantMap[variant] || variant as BadgeVariant);
  let customClass = $derived(customClasses[variant] || '');
</script>

<Badge 
  variant={mappedVariant}
  class="{customClass} {className}"
>
  {@render children()}
</Badge>