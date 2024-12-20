<script lang="ts">
	import { db, type Todo } from '$lib/repository/db';

	interface Props {
		todo: Todo;
	}

	const { todo }: Props = $props();

	const checked = Boolean(todo !== null && todo.done);

	const onChange = (e: Event & { currentTarget: HTMLInputElement }) => {
		if (todo === null) {
			return;
		}
		const done = e.currentTarget.checked;
		db.todos.update(todo.id, { done });
	};
</script>

<t-todo done={todo !== null && todo.done ? '' : undefined}>
	{#if todo !== null}
		<span>{todo.text}</span>
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
			span {
				background: linear-gradient(
					180deg,
					transparent calc(50% - var(--_gradient-size)),
					var(--color-border-muted) calc(50% - var(--_gradient-size)),
					var(--color-border-muted) calc(50% + var(--_gradient-size)),
					transparent calc(50% + var(--_gradient-size))
				);
			}
		}

		span {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		input {
			margin-inline-end: calc(var(--outline-offset) * 2);
		}
	}
</style>
