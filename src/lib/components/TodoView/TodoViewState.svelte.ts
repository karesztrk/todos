import { isToday, weekDays } from './TodoView.util';
import type { TodoDocument } from '$lib/repository/db';
const dateFormatter = new Intl.DateTimeFormat('en', {
	month: '2-digit',
	day: '2-digit'
});

const dayFormatter = new Intl.DateTimeFormat('en', {
	weekday: 'short'
});

export interface WeekDay {
	d: Date;
	date: string;
	name: string;
	today: boolean;
}

class TodoViewState {
	todos: Map<string, TodoDocument[]>;

	range: { start: Date; end: Date };

	constructor(todos: TodoDocument[], range: { start: Date; end: Date }) {
		this.todos = this.pushAll(new Map(), todos);
		this.range = range;
	}

	get weekDays(): WeekDay[] {
		return weekDays(this.range.start).map((d) => ({
			d,
			date: dateFormatter.format(d),
			name: dayFormatter.format(d),
			today: isToday(d)
		}));
	}

	pushAll(map: Map<string, TodoDocument[]>, todos: TodoDocument[]): Map<string, TodoDocument[]> {
		for (const todo of todos) {
			this.push(map, todo);
		}
		return map;
	}

	push(map: Map<string, TodoDocument[]>, todo: TodoDocument): Map<string, TodoDocument[]> {
		const key =
			todo !== null && todo.date ? dateFormatter.format(new Date(todo.date as string)) : 'someday';
		const todos = map.get(key) ?? [];
		map.set(key, [...todos, todo].sort(this.sort));
		return map;
	}

	sort(left: TodoDocument, right: TodoDocument): number {
		return new Date(left.created).getTime() - new Date(right.created).getTime();
	}

	list(date?: Date): TodoDocument[] {
		const key = date ? dateFormatter.format(date) : 'someday';
		return this.todos.get(key) ?? [];
	}
}

export default TodoViewState;
