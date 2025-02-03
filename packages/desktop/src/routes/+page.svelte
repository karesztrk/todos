<script lang="ts">
	import { getNotificationContext } from '$lib/notification/context';
	import { getStoreContext } from '$lib/repository/context';
	import TodoView from '@todotrk/web/components/TodoView';
	import TodoRange from '@todotrk/web/components/TodoView/TodoRange.svelte';
	import { isToday, startOfWeek } from '@todotrk/web/util/date';

	const storeContext = getStoreContext();
	const notificationContext = getNotificationContext();

	const now = new Date();

	const start = startOfWeek(now);
	const range = new TodoRange(start, 6);

	const next = () => {
		range.addDays(7);
	};

	const previous = () => {
		range.addDays(-7);
	};

	const notify = () => {
		const todos = storeContext
			.getAllTodos()
			.filter(({ done }) => !done)
			.filter(({ date }) => (date ? isToday(new Date(date)) : false));

		const todoString =
			todos.length === 0
				? 'You dont have anything for today'
				: 'Here are your daily tasks:\n' + todos.map(({ text }) => `- ${text}`).join('\n');

		notificationContext.send('Friendly reminder', todoString);
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
			<button class="secondary" onclick={notify} aria-label="Add today's tasks as notification">
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none"
					><path
						fill="currentColor"
						d="M9.788 13.6a.8.8 0 0 1 .596 1.335A3.192 3.192 0 0 1 8 16a3.194 3.194 0 0 1-2.384-1.066.8.8 0 0 1 .507-1.328l.088-.005h3.577ZM8 0c1.086 0 2.005.722 2.3 1.713l.037.137.006.034a6.411 6.411 0 0 1 3.22 4.855l.022.23.015.231v2.345l.017.109a2.4 2.4 0 0 0 .914 1.477l.134.094.13.079c.687.39.447 1.413-.302 1.491l-.093.005H1.6c-.822 0-1.11-1.091-.394-1.496a2.4 2.4 0 0 0 1.177-1.65l.017-.115V7.163A6.4 6.4 0 0 1 5.459 2l.198-.117.008-.034A2.402 2.402 0 0 1 7.714.017l.145-.014L8 0Zm0 4.8a.8.8 0 0 0-.8.8v.8h-.8l-.094.006A.8.8 0 0 0 6.4 8h.8v.8l.006.094A.8.8 0 0 0 8.8 8.8V8h.8l.094-.006A.8.8 0 0 0 9.6 6.4h-.8v-.8l-.006-.094A.8.8 0 0 0 8 4.8Z"
					/></svg
				>
			</button>
			<hr aria-orientation="vertical" />
			<div>
				<button onclick={previous}>Prev</button>
				<button onclick={next}>Next</button>
			</div>
		</div>
	</hrgroup>

	<article>
		<TodoView todos={storeContext.getAllTodos()} {range} />
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

		div {
			display: flex;
			flex-flow: row wrap;
			gap: 1rem;

			div {
				gap: 0.75rem;
			}
		}

		hr {
			inline-size: 1px;
			block-size: 28px;
			margin: 0;
			padding: 0;
		}
	}
</style>
