<script lang="ts">
	import Modal from '$lib/components/Modal';
	import { db } from '$lib/repository/db';
	import { getViewContext } from '../TodoView/TodoViewContext.svelte';

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

	const onSubmit = (e: SubmitEvent) => {
		if (!ctx.selectedTodo) {
			return;
		}
		const target = e.target as HTMLFormElement;
		const values = new FormData(target, e.submitter);
		const text = values.get('text') as string | null;
		const done = values.get('done') === 'on';
		console.log(text, done);
		if (text) {
			db.setRow('todos', ctx.selectedTodo, { ...selectedTodo, text, done });
		}
	};
</script>

<Modal bind:show {onClose}>
	<form method="dialog" onsubmit={onSubmit}>
		<div>
			<input type="checkbox" name="done" checked={selectedTodo?.done} />
			<textarea value={selectedTodo?.text} name="text" rows="3"></textarea>
		</div>
		<button type="submit" formmethod="dialog">Save</button>
	</form>
</Modal>

<style>
	div {
		display: flex;
		gap: 1.5rem;

		font-size: 1.5rem;

		input[type='checkbox'] {
			margin-block: 0.35em;
			flex-shrink: 0;
			&:checked {
				color: var(--color-text-muted);

				+ textarea {
					text-decoration: line-through;
					color: var(--color-text-muted);
				}
			}
		}

		margin-block-end: 1rem;
	}
</style>
