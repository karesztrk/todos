<script lang="ts">
	import Header from '@todotrk/web/components/Header';
	import Footer from '@todotrk/web/components/Footer';
	import { setStoreContext } from '$lib/repository/context';
	import '@todotrk/web/style/app.css';
	import '@todotrk/web/style/fonts.css';
	import { setNotificationContext } from '$lib/notification/context';

	let { children } = $props();
	setStoreContext();
	setNotificationContext();
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
