<script lang="ts">
	import Week from '$lib/components/TodoView.svelte';
	import { db, allTodos } from '$lib/repository/db';

	const now = new Date();

	let todos = $state(db.loadQuery(allTodos));
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Todos" />
</svelte:head>

<section>
	<h1>Todos ({now.toLocaleDateString(navigator.language, { month: 'long' })})</h1>

	<article>
		{#await todos}
			<div>Loading...</div>
		{:then todos}
			<Week {todos} />
		{:catch error}
			<!-- promise was rejected -->
			<p>Something went wrong: {error.message}</p>
		{/await}
	</article>
</section>

<style>
</style>
