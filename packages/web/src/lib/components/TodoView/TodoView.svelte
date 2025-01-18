<script lang="ts">
	import { type Todo as TodoType } from '$lib/repository/db';
	import TodoList from '../TodoList';
	import TodoViewState from './TodoViewState.svelte';
	import Todo from '../Todo';
	import { v4 as uuid } from '@lukeed/uuid';
	import TodoDialog from '../TodoDialog/TodoDialog.svelte';
	import { setViewContext } from './TodoViewContext.svelte';
	import { getStoreContext } from '$lib/repository/context';

	const { todos = [], range }: { todos: TodoType[]; range: { start: Date; end: Date } } = $props();

	const storeContext = getStoreContext();

	$effect(() => {
		const active = document.querySelector('t-list[active]');
		let timeout: number;
		if (active) {
			timeout = setTimeout(() => {
				active.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
			}, 100);
		}
		return () => {
			storeContext.cleanup();
			if (timeout) {
				clearTimeout(timeout);
			}
		};
	});

	const viewState = $derived(new TodoViewState(todos, range));

	const onSubmit = (date?: Date) => (e: SubmitEvent) => {
		e.preventDefault();
		const target = e.target as HTMLFormElement;
		const values = new FormData(target, e.submitter);
		const text = values.get('text') as string | null;
		if (text) {
			storeContext.setRow(uuid(), {
				done: false,
				text,
				date,
				created: new Date()
			});
			target.reset();
		}
	};

	const onInput = (e: Event) => {
		(e?.currentTarget as HTMLElement)?.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
			inline: 'nearest'
		});
	};

	setViewContext();
</script>

<t-view>
	{#each viewState.weekDays as { d, date, name, today } (date)}
		<form onsubmit={onSubmit(d)}>
			<TodoList active={today}>
				{#snippet header()}<div class="bold">{date}</div>
					<div class="light">{name}</div>{/snippet}
				{#each viewState.list(d) as todo (todo.id)}
					<Todo {todo} />
				{/each}
				<input type="text" name="text" />
			</TodoList>
		</form>
	{/each}
	<form onsubmit={onSubmit()}>
		<TodoList class="someday">
			{#snippet header()}<div class="bold">Someday</div>{/snippet}
			{#each viewState.list() as todo (todo.id)}
				<Todo {todo} />
			{/each}
			<input type="text" name="text" oninput={onInput} />
		</TodoList>
	</form>
	<TodoDialog />
</t-view>

<style>
	t-view {
		--row-height: calc(30px + 1rem);
		--_min-height: 60dvh;
		--_columns: 6;
		--_break-point: 600px;
		min-block-size: var(--_min-height);
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: repeat(auto-fill, minmax(calc(var(--row-height) * 5), 1fr));
		column-gap: 2rem;
		row-gap: var(--row-height);

		@container main (width > 90ch) {
			grid-template-columns: repeat(var(--_columns), 1fr);

			& > form {
				grid-row: 1 / span 2;

				&:nth-child(n + 6),
				&:nth-child(n + 7) {
					grid-row: span 1;
				}

				&:last-of-type {
					grid-area: 3 / 1 / span 2 / span 2;
				}
			}
		}

		input[type='text'] {
			height: var(--row-height);
		}

		& > form {
			background: repeating-linear-gradient(
				transparent 0 calc(var(--row-height) - 1px),
				rgba(255, 255, 255, 0.25) calc(var(--row-height) - 1px) var(--row-height)
			);
		}
	}
</style>
