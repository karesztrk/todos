<script lang="ts">
	import TodoView from '$lib/components/TodoView';
	import { addDays, startOfWeek } from '$lib/components/TodoView/TodoView.util';
	import { db, allTodos } from '$lib/repository/db';

	const now = new Date();

	const start = startOfWeek(now);
	const range = $state({ start, end: addDays(start, 6) });

	let todos = $state(db.loadQuery(allTodos(range)));

	$effect(() => {
		const unsubscribe = db.subscribeQuery(allTodos(range))(() => {
			const result = db.getQuery(allTodos(range));
			todos = Promise.resolve(result);
		});
		return () => {
			unsubscribe();
		};
	});

	const next = () => {
		range.start = addDays(range.start, 7);
		range.end = addDays(range.end, 7);
		todos = db.loadQuery(allTodos(range));
	};

	const previous = () => {
		range.start = addDays(range.start, -7);
		range.end = addDays(range.end, -7);
		todos = db.loadQuery(allTodos(range));
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Todos" />
</svelte:head>

<section>
	<h1>Todos ({now.toLocaleDateString(navigator.language, { month: 'long' })})</h1>
	<p>
		{range.start.toLocaleDateString(navigator.language, { month: '2-digit', day: '2-digit' })} - {range.end.toLocaleDateString(
			navigator.language,
			{ month: '2-digit', day: '2-digit' }
		)}
	</p>
	<div>
		<button onclick={previous}>Previous</button>
		<button onclick={next}>Next</button>
	</div>

	<article>
		{#await todos}
			<div>Loading...</div>
		{:then todos}
			<TodoView {todos} />
		{:catch error}
			<p>Something went wrong: {error.message}</p>
		{/await}
	</article>
</section>

<style>
</style>
