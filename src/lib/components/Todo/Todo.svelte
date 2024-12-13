<script lang="ts">
	import { db, type TodoRow } from '$lib/repository/db';

	interface Props {
		todo: TodoRow;
	}
	const { todo }: Props = $props();

	const checked = Boolean(todo !== null && todo.done);

	const onChange = (e: Event & { currentTarget: HTMLInputElement }) => {
		if (todo === null) {
			return;
		}
		const done = e.currentTarget.checked;
		db.update('todo', { id: todo.id, done });
	};
</script>

<t-todo done={todo !== null && todo.done ? '' : undefined}>
	{todo !== null && todo.text}
	<input type="checkbox" onchange={onChange} {checked} />
</t-todo>

<style>
	t-todo {
		display: flex;
		justify-content: space-between;
		border-block-end: 1px solid #fff;

		&[done] {
			text-decoration: line-through;
		}
	}
</style>
