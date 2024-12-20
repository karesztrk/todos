<script lang="ts">
	import { db, type Todo as TodoType } from '$lib/repository/db';
	import TodoList from '$lib/components/TodoList';
	import TodoViewState from './TodoViewState.svelte';
	import Todo from '$lib/components/Todo';

	const { todos = [], range }: { todos: TodoType[]; range: { start: Date; end: Date } } = $props();

	const viewState = $derived(new TodoViewState(todos, range));

	const onKeydown = (date?: Date) => async (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;
		const text = target.value;
		if (e.key === 'Enter' && text) {
			await db.todos.add({ done: false, text, date, created: new Date() });
			target.value = '';
		}
	};
</script>

<t-view>
	{#each viewState.weekDays as { d, date, name, today } (d)}
		<div>
			<TodoList active={today}>
				{#snippet header()}<div class="bold">{date}</div>
					<div class="light">{name}</div>{/snippet}
				{#each viewState.list(d) as todo}
					<Todo {todo} />
				{/each}
				<input type="text" name="text" onkeydown={onKeydown(d)} />
			</TodoList>
		</div>
	{/each}
	<div>
		<TodoList class="someday">
			{#snippet header()}<div class="bold">Someday</div>{/snippet}
			{#each viewState.list() as todo (todo.id)}
				<Todo {todo} />
			{/each}
			<input type="text" name="text" onkeydown={onKeydown()} />
		</TodoList>
	</div>
</t-view>

<style>
	t-view {
		--row-height: calc(30px + 1rem);
		--_min-height: 80dvh;
		--_columns: 6;
		--_break-point: 600px;
		min-block-size: var(--_min-height);
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(auto-fill, minmax(calc(var(--row-height) * 5), 1fr));
		column-gap: 2rem;
		row-gap: var(--row-height);

		@container main (width > 90ch) {
			grid-template-columns: repeat(var(--_columns), 1fr);

			& > div {
				grid-row: 1 / span 2;

				&:nth-child(n + 6),
				&:nth-child(n + 7) {
					grid-row: span 1;
				}

				&:last-child {
					grid-column: 1 / span 2;
					grid-row: 3 / span 2;
				}
			}
		}

		input[type='text'] {
			width: 100%;
			height: var(--row-height);
			background: none;
			border: none;
			outline-offset: var(--outline-offset);
		}

		& > div {
			background: repeating-linear-gradient(
				transparent 0 calc(var(--row-height) - 1px),
				rgba(255, 255, 255, 0.25) calc(var(--row-height) - 1px) var(--row-height)
			);
		}
	}
</style>
