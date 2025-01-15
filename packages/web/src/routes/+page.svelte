<script lang="ts">
	import TodoView from '$lib/components/TodoView';
	import TodoRange from '$lib/components/TodoView/TodoRange.svelte';
	import { startOfWeek } from '$lib/components/TodoView/TodoView.util';
	import { getStoreContext } from '$lib/repository/context';

	const now = new Date();

	const start = startOfWeek(now);
	const range = new TodoRange(start, 6);

	const store = getStoreContext();

	let todos = $state(store.getAllTodos());

	store.store.addTableListener('todos', () => {
		todos = store.getAllTodos();
	});

	const next = () => {
		range.addDays(7);
	};

	const previous = () => {
		range.addDays(-7);
	};
</script>

<svelte:head>
	<title>Todo</title>
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
		{#if !todos}
			<div>Loading...</div>
		{:else}
			<TodoView {todos} {range} />
		{/if}
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
