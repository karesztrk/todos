<script lang="ts">
	import TodoView from '$lib/components/TodoView';
	import TodoRange from '$lib/components/TodoView/TodoRange.svelte';
	import { startOfWeek } from '$lib/util/date';
	import { getStoreContext } from '$lib/repository/context';

	const now = new Date();

	const start = startOfWeek(now);
	const range = new TodoRange(start, 6);

	const store = getStoreContext();

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
		<TodoView todos={store.getAllTodos()} {range} />
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
