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
	<t-dialog-content>
		<div>
			<label for="date">Due</label>
			<input
				id="date"
				type="date"
				value={selectedTodo?.date && toDateString(new Date(selectedTodo?.date))}
				onchange={onDateChange}
			/>
		</div>
		<input
			type="checkbox"
			checked={selectedTodo?.done}
			onchange={onDoneChange}
			aria-label="Todo done"
		/>
		<textarea value={selectedTodo?.text} rows="2" oninput={onTextChange} aria-label="Todo text"
		></textarea>
	</t-dialog-content>
	{#snippet actions()}
		<form method="dialog">
			<button formmethod="dialog" aria-label="Ok and close dialog">OK</button>
		</form>
	{/snippet}
</Modal>

<style>
	t-dialog-content {
		display: grid;
		grid-template-columns: 1fr min-content;
		align-items: center;
		font-size: 1.15rem;

		@supports (font-size: 1cqi) {
			font-size: clamp(1rem, 4cqi, 1.25rem);
		}

		textarea {
			margin-block: 2rem;

			@container modal (width > 50ch) {
				margin-block: 2.5rem;
			}

			grid-column: span 2;

			font-size: 1.5rem;

			@supports (font-size: 1cqi) {
				font-size: clamp(1.25rem, 5cqi, 1.5rem);
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
			justify-self: flex-start;
			width: auto;
		}
	}
</style>
