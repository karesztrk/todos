<script lang="ts">
	import { Either } from 'effect';
	import * as S from '@effect/schema/Schema';
	import { NonEmptyString1000 } from '@evolu/common';
	import { db, type TodoRows } from '$lib/repository/db';
	import TodoList from '$lib/components/TodoList';
	import TodoViewState from './TodoViewState.svelte';
	import Todo from '$lib/components/Todo';

	const { todos }: { todos: TodoRows } = $props();

	const viewState = $derived(new TodoViewState(todos));

	const onKeydown = (date?: Date) => (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;
		const text = S.decodeUnknownEither(NonEmptyString1000)(target.value);
		if (e.key === 'Enter' && Either.isRight(text)) {
			db.create('todo', { done: false, text: text.right, date });
			target.value = '';
		}
	};
</script>

<t-view>
	{#each viewState.weekDays as { d, date, name, today }, i}
		<TodoList active={today} weekend={i === 5 || i === 6}>
			{#snippet header()}<div>{date}</div>
				{name}{/snippet}
			{#each viewState.list(d) as todo}
				<Todo {todo} />
			{/each}
			<input type="text" name="text" onkeydown={onKeydown(d)} />
		</TodoList>
	{/each}
	<TodoList someday>
		{#snippet header()}Someday{/snippet}
		{#each viewState.list() as todo}
			<Todo {todo} />
		{/each}
		<input type="text" name="text" onkeydown={onKeydown()} />
	</TodoList>
</t-view>

<style>
	t-view {
		--max-row-height: 30px;
		--min-height: 100vh;
		--columns: 6;
		--active-color: hotpink;
		min-block-size: var(--min-height);
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		/* grid-template-rows: repeat(auto-fill, minmax(100%, var(--max-row-height))); */
		column-gap: 2rem;

		input[type='text'] {
			width: 100%;
			height: var(--max-row-height);
		}
	}
</style>
