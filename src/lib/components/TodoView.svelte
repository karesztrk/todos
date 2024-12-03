<script lang="ts">
	import Todo from './Todo.svelte';
	import View from './View.svelte';

	const view = new View();

	const onKeydown = (date?: Date) => (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;
		const text = target.value;
		if (e.key === 'Enter' && text) {
			const todo = new Todo(text, date);
			view.push(todo);
			target.value = '';
		}
	};
</script>

<t-view style="--rows: 6">
	{#each view.weekDays as { d, date, name, today }, i}
		<t-list active={today ? '' : undefined} weekend={i === 5 || i === 6 ? '' : undefined}>
			<t-header
				><div>{date}</div>
				{name}</t-header
			>
			{#each view.list(d) as todo}
				<t-todo done={todo.done ? '' : undefined}>
					{todo.text}
					<input type="checkbox" bind:checked={todo.done} />
				</t-todo>
			{/each}
			<input type="text" name="text" onkeydown={onKeydown(d)} />
		</t-list>
	{/each}
	<t-list someday>
		<t-header>Someday</t-header>
		{#each view.list() as todo}
			<t-todo done={todo.done ? '' : undefined}>
				{todo.text}
				<input type="checkbox" bind:checked={todo.done} />
			</t-todo>
		{/each}
		<input name="text" type="text" onkeydown={onKeydown()} />
	</t-list>
</t-view>

<style>
	t-view {
		--max-row-height: 30px;
		--min-height: 100vh;
		--columns: 6;
		--day-span: 6;
		--weekend-span: calc(var(--day-span) / 2);
		--active-color: hotpink;
		min-block-size: var(--min-height);
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		/* grid-template-rows: repeat(auto-fill, minmax(100%, var(--max-row-height))); */
		column-gap: 2rem;
		t-list {
			display: grid;
			grid-template-columns: 1fr;
			grid-auto-rows: var(--max-row-height);
			grid-row: span 2;
			background: repeating-linear-gradient(
				transparent 0 calc(var(--max-row-height) - 1px),
				rgba(255, 255, 255, 0.25) calc(var(--max-row-height) - 1px) var(--max-row-height)
			);

			&[weekend] {
				grid-row: span 1;
			}

			&[active] {
				color: var(--active-color);
			}

			&[someday] {
				grid-column: span 2;
			}

			input[type='text'] {
				width: 100%;
				height: var(--max-row-height);
			}

			t-header,
			t-todo {
				display: flex;
				justify-content: space-between;
				border-block-end: 1px solid #fff;
			}

			t-todo[done] {
				text-decoration: line-through;
			}
		}
	}
</style>
