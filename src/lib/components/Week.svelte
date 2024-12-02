<script lang="ts">
	import { DAY, isToday, startOfWeek } from './Week.util';

	interface Todo {
		date?: Date;
		text: string;
		done: boolean;
	}

	type TodoGroup = Record<string, Todo[]>;

	const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
		month: '2-digit',
		day: '2-digit'
	});

	const dayFormatter = new Intl.DateTimeFormat(navigator.language, {
		weekday: 'short'
	});

	const today = new Date();

	const startDate = startOfWeek(today);

	const days = Array.from({ length: 7 }, (_, i) => new Date(startDate.getTime() + i * DAY)).map(
		(d) => ({
			d,
			date: dateFormatter.format(d),
			name: dayFormatter.format(d),
			today: isToday(d)
		})
	);

	const todos = $state<Todo[]>([]);

	const derivedTodos = $derived.by<TodoGroup>(() => {
		return todos.reduce((acc, todo) => {
			const key = todo.date ? dateFormatter.format(todo.date) : 'someday';
			acc[key] = acc[key] || [];
			acc[key].push(todo);
			return acc;
		}, {} as TodoGroup);
	});

	const maxTodos = $derived.by<number>(() => {
		return Object.values(derivedTodos).reduce((a, b) => Math.max(a, b.length), 0);
	});

	const onKeydown = (date: Date) => (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;
		const text = target.value;
		if (e.key === 'Enter' && text) {
			const todo: Todo = {
				date,
				text,
				done: false
			};
			todos.push(todo);
			target.value = '';
		}
	};
</script>

<t-week style="--rows: {maxTodos}">
	{#each days as { d, date, name, today }, i}
		<t-day active={today ? '' : undefined} weekend={i === 5 || i === 6 ? '' : undefined}>
			<t-header
				><div>{date}</div>
				{name}</t-header
			>
			{#each derivedTodos[date] || [] as todo}
				<t-todo done={todo.done ? '' : undefined}>
					{todo.text}
					<input type="checkbox" bind:checked={todo.done} />
				</t-todo>
			{/each}
			<input type="text" name="text" onkeydown={onKeydown(d)} />
		</t-day>
	{/each}
	<t-day someday>
		<t-header>Someday</t-header>
		<input name="text" type="text" />
		<t-footer></t-footer>
	</t-day>
	<t-day someday>
		<t-header></t-header>
		<input type="text" />
		<t-footer></t-footer>
	</t-day>
	<t-day someday>
		<t-header></t-header>
		<input type="text" />
		<t-footer></t-footer>
	</t-day>
</t-week>

<style>
	t-week {
		--min-width: 100px;
		--max-row-height: 30px;
		--min-height: 90vh;
		--columns: 6;
		--day-span: calc(var(--rows) + 6);
		--weekend-span: calc(var(--day-span) / 2);
		--active-color: hotpink;
		min-block-size: var(--min-height);
		display: grid;
		grid-template-columns: repeat(var(--columns), minmax(min(100%, var(--min-width)), 1fr));
		/* grid-template-rows: repeat(auto-fill, minmax(100%, var(--max-row-height))); */
		grid-auto-rows: minmax(100%, var(--max-row-height));
		column-gap: 2rem;
		t-day {
			display: grid;
			grid-template-rows: subgrid;
			grid-row: span var(--day-span);

			&[weekend] {
				grid-row: span var(--weekend-span);
			}

			&:not([weekend]) {
				t-footer {
					grid-row: span 4;
				}
			}

			&[active] {
				color: var(--active-color);
			}

			&[someday] {
				grid-column: span 2;
			}

			t-header,
			t-todo {
				display: flex;
				justify-content: space-between;
				border-block-end: 1px solid #fff;
			}

			t-todo[done] {
				text-decoration: line-through;
			}

			t-footer {
				background: repeating-linear-gradient(
					transparent 0 calc(var(--max-row-height) - 1px),
					rgba(255, 255, 255, 0.25) calc(var(--max-row-height) - 1px) var(--max-row-height)
				);
			}
		}
	}
</style>
