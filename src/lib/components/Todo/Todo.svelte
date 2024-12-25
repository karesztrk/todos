<script lang="ts">
	import { db, type Todo } from '$lib/repository/db';
	import { getViewContext } from '../TodoView/TodoViewContext.svelte';

	interface Props {
		todo: Todo;
	}

	const { todo }: Props = $props();

	const ctx = getViewContext();

	const checked = Boolean(todo !== null && todo.done);

	const onChange = (e: Event & { currentTarget: HTMLInputElement }) => {
		if (todo === null) {
			return;
		}
		const done = e.currentTarget.checked;
		db.setCell('todos', todo.id, 'done', done);
	};

	const onClick = () => {
		ctx.selectedTodo = todo.id;
	};
</script>

<t-todo done={todo !== null && todo.done ? '' : undefined} role="listitem">
	{#if todo !== null}
		<button onclick={onClick}>{todo.text}</button>
	{/if}
	<input type="checkbox" onchange={onChange} {checked} />
</t-todo>

<style>
	t-todo {
		--_strike-size: 2px;
		--_gradient-size: calc(var(--_strike-size) * 0.5);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		border-block-end: 1px solid var(--color-border-muted);
		overflow: hidden;

		&[done] {
			color: var(--color-text-muted);
			button {
				background: linear-gradient(
					180deg,
					transparent calc(50% - var(--_gradient-size)),
					var(--color-border-muted) calc(50% - var(--_gradient-size)),
					var(--color-border-muted) calc(50% + var(--_gradient-size)),
					transparent calc(50% + var(--_gradient-size))
				);
			}
		}

		button {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			background: none;
			text-align: left;
			border: none;
			border-radius: 0px;
			padding: 0;
			margin-inline: 4px;
			color: inherit;
		}

		input {
			margin-inline-end: calc(var(--outline-offset) * 2);
			flex-shrink: 0;
		}
	}
</style>
