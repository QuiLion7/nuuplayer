// Allows TypeScript to resolve .svelte files imported from .ts modules
declare module '*.svelte' {
	import type { Component } from 'svelte';
	const component: Component;
	export default component;
}
