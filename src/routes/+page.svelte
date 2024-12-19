<script lang="ts">
	import TodoView from '$lib/components/TodoView';
	import { addDays, startOfWeek } from '$lib/components/TodoView/TodoView.util';
	import { allTodos, db, type TodoDocument } from '$lib/repository/db';

	const now = new Date();

	const start = startOfWeek(now);
	const range = $state({ start, end: addDays(start, 6) });

	const inRange = (todos: TodoDocument[]) =>
		todos.filter(
			(todo) =>
				todo.date === null ||
				(range.start.getTime() <= new Date(todo.date).getTime() &&
					new Date(todo.date).getTime() <= range.end.getTime())
		);

	let todos = $state(db.todos.find(allTodos).exec().then(inRange));

	$effect(() => {
		const observable = db.todos.find(allTodos).$;
		const subscription = observable.subscribe((update) => {
			todos = Promise.resolve(inRange(update));
		});
		return () => {
			subscription.unsubscribe();
		};
	});

	const next = () => {
		range.start = addDays(range.start, 7);
		range.end = addDays(range.end, 7);
		todos = db.todos.find(allTodos).exec().then(inRange);
	};

	const previous = () => {
		range.start = addDays(range.start, -7);
		range.end = addDays(range.end, -7);
		todos = db.todos.find(allTodos).exec().then(inRange);
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Todos" />
</svelte:head>

<section>
	<hrgroup>
		<h1>Todos ({range.start.toLocaleDateString('en', { month: 'long' })})</h1>
		<div>
			<button onclick={previous}>Prev</button>
			<button onclick={next}>Next</button>
		</div>
	</hrgroup>

	<article>
		{#await todos}
			<div>Loading...</div>
		{:then todos}
			<TodoView {todos} {range} />
		{:catch error}
			<p>Something went wrong: {error.message}</p>
		{/await}
	</article>
</section>

<style>
	section {
		hrgroup {
			margin-block-start: 20px;
			margin-block-end: 2rem;

			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			align-items: center;
			gap: 1rem;
		}
	}
</style>
