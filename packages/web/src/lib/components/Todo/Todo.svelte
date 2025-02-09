<script lang="ts">
	import { getStoreContext } from '$lib/repository/context';
	import { type Todo } from '$lib/repository/db';
	import { getViewContext } from '../TodoView/TodoViewContext.svelte';

	interface Props {
		todo: Todo;
	}

	const { todo }: Props = $props();

	let element = $state<HTMLElement>();

	const viewContext = getViewContext();
	const storeContext = getStoreContext();

	const checked = $derived(Boolean(todo !== null && todo.done));

	const elasticEasing =
		'linear(0, 0.03 1.5%, 0.121 3.2%, 0.851 13%, 0.99 16.4%, 1.063 20.2%, 1.076 22.3%, 1.075 24.8%, 1.013 35.9%, 0.995 43.4%, 1)';

	const onChange = (e: Event & { currentTarget: HTMLInputElement }) => {
		if (todo === null) {
			return;
		}
		const done = e.currentTarget.checked;
		storeContext.setCell(todo.id, 'done', done);

		if (element) {
			if (done) {
				element.animate([{ '--background-size': '100%' }], {
					duration: 500,
					fill: 'both',
					easing: elasticEasing
				});
			} else {
				element.animate([{ '--background-size': '0%' }], {
					duration: 100,
					fill: 'both',
					easing: 'ease-out'
				});
			}
		}
	};

	const onClick = () => {
		viewContext.selectedTodo = todo.id;
	};
</script>

<t-todo
	bind:this={element}
	done={todo !== null && todo.done ? '' : undefined}
	role="listitem"
	style:--_transition-easing={elasticEasing}
>
	{#if todo !== null}
		<button type="button" onclick={onClick}>{todo.text}</button>
	{/if}
	<input type="checkbox" onchange={onChange} {checked} defaultchecked={checked} />
</t-todo>

<style>
	t-todo {
		--_strike-size: 2px;
		--_gradient-size: calc(var(--_strike-size) * 0.5);
		--_transition-duration: 300ms;

		display: grid;
		grid-template-columns: 1fr auto;
		align-content: center;
		gap: 20px;
		border-block-end: 1px solid var(--color-border-muted);

		&[done] {
			color: var(--color-text-muted);
			--background-size: 100%;
		}

		button {
			inline-size: 100%;
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

			transition: color var(--_transition-duration) var(--_transition-easing);
			&:active {
				outline: revert;
			}
		}

		input {
			margin-inline-end: calc(var(--outline-offset) * 2);
		}
	}
</style>
