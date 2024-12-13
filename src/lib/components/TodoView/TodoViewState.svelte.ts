import { DAY, isToday, startOfWeek, weekDays } from './TodoView.util';
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
	todos: Map<string, TodoRow[]>;

	constructor(todos: TodoRows) {
		this.todos = this.pushAll(new Map(), todos);
	}

	get weekDays(): WeekDay[] {
		const today = new Date();
		const startDate = startOfWeek(today);
		return weekDays(startDate).map((d) => ({
			d,
			date: dateFormatter.format(d),
			name: dayFormatter.format(d),
			today: isToday(d)
		}));
	}

	pushAll(map: Map<string, TodoRow[]>, todos: TodoRows) {
		for (const todo of todos.rows) {
			this.push(map, todo);
		}
		return map;
	}

	push(map: Map<string, TodoRow[]>, todo: TodoRow) {
		const key =
			todo !== null && todo.date ? dateFormatter.format(new Date(todo.date as string)) : 'someday';
		const todos = map.get(key) ?? [];
		map.set(key, [...todos, todo]);
		return map;
	}

	list(date?: Date) {
		const key = date ? dateFormatter.format(date) : 'someday';
		return this.todos.get(key) ?? [];
	}
}

export default TodoViewState;
