<script lang="ts">
	import Header from '@todotrk/web/components/Header';
	import Footer from '@todotrk/web/components/Footer';
	import { setStoreContext } from '$lib/repository/context';
	import '@todotrk/web/style/app.css';
	import '@todotrk/web/style/fonts.css';

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
