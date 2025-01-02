<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import '../fonts.css';
	import Footer from './Footer.svelte';

	let { children } = $props();
</script>

<Header />

<main>
	{@render children()}
</main>

<Footer />

<style>
	main {
		grid-column: content;
		container: main / inline-size;
	}
</style>
