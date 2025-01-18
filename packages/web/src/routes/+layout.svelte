<script lang="ts">
	import Footer from '$lib/components/Footer';
	import Header from '$lib/components/Header';
	import { setStoreContext } from '$lib/repository/context';
	import '../style/app.css';
	import '../style/fonts.css';

	let { children } = $props();
	setStoreContext();
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
