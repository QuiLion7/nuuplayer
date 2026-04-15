<script lang="ts" generics="T">
  import { onMount, onDestroy } from 'svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    items: T[];
    selectedIndex?: number;
    onSelectionChange?: (index: number) => void;
    gridId?: string;
    class?: string;
    children: Snippet<[T, number, boolean]>;
  }

  let {
    items,
    selectedIndex = $bindable(0),
    onSelectionChange,
    gridId = 'keyboard-grid',
    class: className = '',
    children
  }: Props = $props();

  // Calcula o número de colunas do grid baseado no CSS
  function getColumns(): number {
    if (typeof document === 'undefined') return 1;

    const grid = document.getElementById(gridId);

    if (!grid) return 1;
    
    const style = window.getComputedStyle(grid);
    const columns = style.gridTemplateColumns.split(' ').length;

    return Math.max(1, columns);
  }

  // Manipula navegação por teclado no grid
  function handleKeydown(e: KeyboardEvent): void {
    if (items.length === 0) return;

    const target = e.target as HTMLElement;
    const tag = target?.tagName;
    
    // Ignora se estiver em campos de input
    if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) {
      return;
    }

    const cols = getColumns();
    const maxIndex = items.length - 1;

    let newIndex = selectedIndex;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = Math.min(newIndex + 1, maxIndex);
        e.preventDefault();
        break;
      case 'ArrowLeft':
        newIndex = Math.max(newIndex - 1, 0);
        e.preventDefault();
        break;
      case 'ArrowDown':
        newIndex = Math.min(newIndex + cols, maxIndex);
        e.preventDefault();
        break;
      case 'ArrowUp':
        newIndex = Math.max(newIndex - cols, 0);
        e.preventDefault();
        break;
      case 'Tab':
        e.preventDefault();
        break;
    }

    if (newIndex !== selectedIndex) {
      selectedIndex = newIndex;
      onSelectionChange?.(newIndex);
      focusSelected();
    } else if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      focusSelected();
    }
  }

  // Foca no item selecionado
  function focusSelected(): void {
    if (items.length === 0) return;
    
    const element = document.querySelector(`#${gridId} [data-grid-index="${selectedIndex}"]`) as HTMLElement;
    element?.focus();
  }

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
    // Pequeno delay para assegurar a renderização do DOM
    setTimeout(focusSelected, 50);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeydown);
    }
  });
</script>

<div 
  id={gridId}
  class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 {className}"
>
  {#each items as item, index (index)}
    <div data-grid-index={index}>
      {@render children(item, index, selectedIndex === index)}
    </div>
  {/each}
</div>