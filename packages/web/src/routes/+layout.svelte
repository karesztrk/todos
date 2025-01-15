<script lang="ts">
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

<footer></footer>

<style>
	main,
	footer {
		grid-column: content;
		container: main / inline-size;
	}
</style>
