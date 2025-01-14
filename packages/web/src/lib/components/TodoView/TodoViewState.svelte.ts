import { isToday, weekDays } from './TodoView.util';
import type { Todo } from '$lib/repository/db';
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

interface Range {
	start: Date;
	end: Date;
}

class TodoViewState {
	todos: Map<string, Todo[]>;

	range: Range;

	constructor(todos: Todo[], range: Range) {
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

	pushAll(map: Map<string, Todo[]>, todos: Todo[]) {
		for (const todo of todos) {
			this.push(map, todo);
		}
		return map;
	}

	push(map: Map<string, Todo[]>, todo: Todo) {
		const key = todo !== null && todo.date ? dateFormatter.format(todo.date) : 'someday';
		const todos = map.get(key) ?? [];
		map.set(key, [...todos, todo].sort(this.sort));
		return map;
	}

	sort(left: Todo, right: Todo): number {
		return new Date(left.created).getTime() - new Date(right.created).getTime();
	}

	list(date?: Date) {
		const key = date ? dateFormatter.format(date) : 'someday';
		return this.todos.get(key) ?? [];
	}
}

export default TodoViewState;
