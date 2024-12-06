<script lang="ts">
	import { useAccount } from '$lib/jazz';
	import Todo from './Todo.svelte';
	import TodoList from './TodoList.svelte';
	import TodoState from './TodoState.svelte';
	import TodoViewState from './TodoViewState.svelte';

	const viewState = new TodoViewState();
	const { me } = useAccount();

	const onKeydown = (date?: Date) => (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;
		const text = target.value;
		if (e.key === 'Enter' && text && me) {
			const todo = TodoState.create({ text, date, done: false }, { owner: me });
			viewState.push(todo);
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
		<input name="text" type="text" onkeydown={onKeydown()} />
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
