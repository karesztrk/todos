<script lang="ts">
	import type TodoState from './TodoState.svelte';

	interface Props {
		todo: TodoState;
	}
	const { todo }: Props = $props();
</script>

<t-todo done={todo.done ? '' : undefined}>
	{todo.text}
	<input type="checkbox" bind:checked={todo.done} />
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
