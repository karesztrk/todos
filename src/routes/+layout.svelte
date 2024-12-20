<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import '../fonts.css';
	import { db } from '$lib/repository/db';

	let { children } = $props();
</script>

<Header />

<main>
	{@render children()}
</main>

<footer></footer>

<style>
	main,
	footer {
		grid-column: content;
		container: main / inline-size;
	}
</style>
