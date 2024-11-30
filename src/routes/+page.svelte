<script lang="ts">
	import Week from '$lib/components/Week.svelte';
	import Counter from './Counter.svelte';
	const now = new Date();
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Todos" />
</svelte:head>

<section>
	<h1>Todos ({now.toLocaleDateString(navigator.language, { month: 'long' })})</h1>

	<article>
		<Week />
	</article>

	<Counter />
</section>

<style>
</style>
