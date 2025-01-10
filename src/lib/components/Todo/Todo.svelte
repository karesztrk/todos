<script lang="ts">
	import { db, type Todo } from '$lib/repository/db';
	import { getViewContext } from '../TodoView/TodoViewContext.svelte';

	interface Props {
		todo: Todo;
	}

	const { todo }: Props = $props();

	let element = $state<HTMLElement>();

	const ctx = getViewContext();

	const checked = Boolean(todo !== null && todo.done);

	const onChange = (e: Event & { currentTarget: HTMLInputElement }) => {
		if (todo === null) {
			return;
		}
		const done = e.currentTarget.checked;
		db.setCell('todos', todo.id, 'done', done);

		if (element) {
			if (done) {
				element.animate([{ '--background-size': '100%' }], {
					duration: 200,
					fill: 'forwards',
					easing: 'ease'
				});
			} else {
				element.animate([{ '--background-size': '0%' }], {
					duration: 100,
					fill: 'forwards',
					easing: 'ease-out'
				});
			}
		}
	};

	const onClick = () => {
		ctx.selectedTodo = todo.id;
	};

	$effect(() => {});
</script>

<t-todo bind:this={element} done={todo !== null && todo.done ? '' : undefined} role="listitem">
	{#if todo !== null}
		<button type="button" onclick={onClick}>{todo.text}</button>
	{/if}
	<input type="checkbox" onchange={onChange} {checked} />
</t-todo>

<style>
	t-todo {
		--_strike-size: 2px;
		--_gradient-size: calc(var(--_strike-size) * 0.5);
		--_transition-duration: 400ms;

		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
		border-block-end: 1px solid var(--color-border-muted);
		overflow: visible;

		&[done] {
			color: var(--color-text-muted);
			--background-size: 100%;
		}

		button {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			background-color: transparent;
			background-repeat: no-repeat;
			text-align: left;
			border: none;
			border-radius: 0px;
			padding: 0;
			margin-inline: 4px;
			color: inherit;

			background-size: var(--background-size);
			background-image: linear-gradient(
				180deg,
				transparent calc(50% - var(--_gradient-size)),
				var(--color-border-muted) calc(50% - var(--_gradient-size)),
				var(--color-border-muted) calc(50% + var(--_gradient-size)),
				transparent calc(50% + var(--_gradient-size))
			);

			transition: color var(--_transition-duration) ease;
			&:active {
				outline: revert;
			}
		}

		input {
			margin-inline-end: calc(var(--outline-offset) * 2);
			flex-shrink: 0;
		}
	}
</style>
