import Dexie, { liveQuery, type EntityTable } from 'dexie';
import { SvelteMap } from 'svelte/reactivity';

export interface Todo {
	id: string;
	text: string;
	done: boolean;
	date?: Date;
	created: Date;
}

export type Cell = keyof Todo;

export interface Store {
	getAllTodos(): Todo[];
	setCell<C extends Cell>(rowId: string, cell: C, value: Todo[C]): void;
	deleteCell(rowId: string, cell: Cell): void;
	getRow(rowId: string): Todo | undefined;
	setRow(id: string, data: Todo): void;
	cleanup(): void;
}

type Database = Dexie & {
	todos: EntityTable<Todo, 'id'>;
};

class WebStore implements Store {
	db: Database;
	// unsubscribe
	query: () => void;
	todos = new SvelteMap<Todo['id'], Todo>();
	_dbName = 'todotrk';
	_schema = '++id, text, done, date, created';

	constructor() {
		this.db = new Dexie(this._dbName) as Database;
		this.db.version(1).stores({
			todos: this._schema
		});

		this.query = liveQuery(() => this.db.todos.toArray()).subscribe((todos) => {
			this.todos.clear();
			for (const todo of todos) {
				this.todos.set(todo.id, todo);
			}
		}).unsubscribe;
	}

	cleanup(): void {
		this.query();
		this.todos.clear();
	}

	getAllTodos() {
		return Array.from(this.todos.values());
	}

	setCell<C extends Cell>(rowId: string, cell: C, value: Todo[C]) {
		this.db.todos.update(rowId, { [cell]: value });
	}

	deleteCell(rowId: string, cell: Cell) {
		this.db.todos.update(rowId, { [cell]: undefined });
	}

	getRow(rowId: string) {
		return this.todos.get(rowId);
	}

	setRow(id: string, data: Omit<Todo, 'id'>) {
		this.db.todos.add({ id, ...data });
	}
}

export default WebStore;
