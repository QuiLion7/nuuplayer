<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher, mode } from "mode-watcher";
	import { profile } from '$lib/stores/profile';
	import { onMount, onDestroy } from 'svelte';
	import { debugOpen } from '$lib/stores/ui';
	import { initTracker, destroyTracker } from '$lib/tracking/tracker';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Header from '$lib/components/common/header.svelte';
	import DebugPanel from '$lib/components/common/debug-panel.svelte';
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import Footer from '$lib/components/common/footer.svelte';

	let { children } = $props();

	const profileAnnouncement = $derived(
		$profile.type !== 'Unknown' 
			? `Perfil detectado: ${$profile.type}. ${$profile.reason}` 
			: ''
	);

  $effect(() => {
    if (typeof document !== 'undefined') {
      if (mode.current === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  });

	async function handleGlobalKeydown(e: KeyboardEvent) {
		const tag = (e.target as HTMLElement)?.tagName;
		const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;
		if (isTyping) return;

		if (e.key === 'Backspace' && page.url.pathname !== '/') {
			e.preventDefault();
			await goto(resolve('/'));
			return;
		}

		if (e.key === 'd' || e.key === 'D') debugOpen.update((v) => !v);
		if (e.key === 'Escape') debugOpen.set(false);
	}

	onMount(() => {
		initTracker();
		window.addEventListener('keydown', handleGlobalKeydown);
		// Persist or initialize default class
		if (typeof document !== 'undefined' && mode.current === 'dark') {
			document.documentElement.classList.add('dark');
		}
	});

	onDestroy(() => {
		destroyTracker();
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleGlobalKeydown);
		}
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<ModeWatcher />
<Header />	

<div class="sr-only" aria-live="polite">
	{profileAnnouncement}
</div>

<DebugPanel />
<Footer />
<Toaster richColors position="top-center" />

<main class="pb-16 max-sm:pb-14">
  {@render children()}
</main>
