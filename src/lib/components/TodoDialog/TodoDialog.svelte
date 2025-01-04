<script lang="ts">
	import Modal from '$lib/components/Modal';
	import { db } from '$lib/repository/db';
	import { getViewContext } from '../TodoView/TodoViewContext.svelte';
	import { toDateString } from './TodoDialog.util';

	const ctx = getViewContext();

	let show = $state(false);

	const selectedTodo = $derived(
		ctx.selectedTodo ? db.getRow('todos', ctx.selectedTodo) : undefined
	);

	$effect(() => {
		if (ctx.selectedTodo) {
			show = true;
		} else {
			show = false;
		}
	});

	const onClose = () => {
		ctx.selectedTodo = undefined;
	};

	const onDoneChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const done = target.checked;
		if (!ctx.selectedTodo) {
			return;
		}
		db.setCell('todos', ctx.selectedTodo, 'done', done);
	};

	const onTextChange = (e: Event) => {
		const target = e.target as HTMLTextAreaElement;
		const text = target.value;
		if (!ctx.selectedTodo) {
			return;
		}
		db.setCell('todos', ctx.selectedTodo, 'text', text);
	};

	const onDateChange = (e: Event) => {
		const target = e.target as HTMLInputElement;
		const date = target.value;
		if (!ctx.selectedTodo) {
			return;
		}
		db.setCell('todos', ctx.selectedTodo, 'date', date);
	};
</script>

<Modal bind:show {onClose}>
	<div>
		<input
			type="date"
			value={selectedTodo?.date && toDateString(new Date(selectedTodo?.date))}
			name="date"
			onchange={onDateChange}
		/>
		<input type="checkbox" name="done" checked={selectedTodo?.done} onchange={onDoneChange} />
		<textarea value={selectedTodo?.text} name="text" rows="2" oninput={onTextChange}></textarea>
	</div>
	<form method="dialog">
		<button formmethod="dialog">OK</button>
	</form>
</Modal>

<style>
	div {
		display: grid;
		grid-template-columns: 1fr min-content;
		gap: 1rem;
		container: todo-dialog / inline-size;
		align-items: center;

		font-size: 1.15rem;

		@supports (font-size: 1cqi) {
			font-size: min(calc(0.5rem + 1cqi), 1.15rem);
		}

		textarea {
			grid-column: span 2;

			font-size: 1.5rem;

			@supports (font-size: 1cqi) {
				font-size: min(calc(1rem + 1cqi), 1.5rem);
			}
		}

		input[type='checkbox'] {
			&:checked {
				color: var(--color-text-muted);

				~ textarea {
					text-decoration: line-through;
					color: var(--color-text-muted);
				}
			}
		}

		input[type='date'] {
			width: auto;
			justify-self: flex-start;
		}

		margin-block-end: 1rem;
	}
</style>
