import { SvelteMap } from 'svelte/reactivity';

import { DAY, isToday, startOfWeek } from './TodoView.util';
import type { TodoRow, TodoRows } from '$lib/repository/db';
const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
	month: '2-digit',
	day: '2-digit'
});

const dayFormatter = new Intl.DateTimeFormat(navigator.language, {
	weekday: 'short'
});

export interface WeekDay {
	d: Date;
	date: string;
	name: string;
	today: boolean;
}

class TodoViewState {
	todos: SvelteMap<string, TodoRow[]>;

	constructor(todos: TodoRows) {
		this.todos = new SvelteMap();

		this.pushAll(todos);
	}

	get weekDays(): WeekDay[] {
		const today = new Date();
		const startDate = startOfWeek(today);
		return Array.from({ length: 7 }, (_, i) => new Date(startDate.getTime() + i * DAY)).map(
			(d) => ({
				d,
				date: dateFormatter.format(d),
				name: dayFormatter.format(d),
				today: isToday(d)
			})
		);
	}

	pushAll(todos: TodoRows) {
		for (const todo of todos.rows) {
			this.push(todo);
		}
	}

	push(todo: TodoRow) {
		const key =
			todo !== null && todo.date ? dateFormatter.format(new Date(todo.date as string)) : 'someday';
		const todos = this.todos.get(key) ?? [];
		this.todos.set(key, [...todos, todo]);
	}

	list(date?: Date) {
		const key = date ? dateFormatter.format(date) : 'someday';
		return this.todos.get(key) ?? [];
	}

	clear() {
		this.todos.clear();
	}
}

export default TodoViewState;
