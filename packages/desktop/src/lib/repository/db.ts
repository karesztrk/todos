import Database from '@tauri-apps/plugin-sql';
import type { Store, Todo, Cell } from '@todotrk/web/repository/db';
import { SvelteMap } from 'svelte/reactivity';

type TodoRow = Omit<Todo, 'date' | 'created' | 'done'> & {
	done: number;
	date: string;
	created: string;
};

class TauriStore implements Store {
	db?: Database;
	todos = new SvelteMap<Todo['id'], Todo>();
	_selectAllQuery = 'SELECT id, text, done, date, created FROM todos';
	_path = 'sqlite:sqlite.db';

	constructor() {
		Database.load(this._path)
			.then((db) => {
				this.db = db;
				return db;
			})
			.then((db) => db.select<TodoRow[]>(this._selectAllQuery))
			.then((data) => this.fillStore(data))
			.catch(console.error);
	}

	cleanup(): void {
		this.db?.close();
		this.todos.clear();
	}

	getAllTodos(): Todo[] {
		return Array.from(this.todos.values());
	}

	setCell<C extends Cell>(rowId: string, cell: C, value: Todo[C]) {
		if (!this.db) {
			throw new Error('Database not initialized');
		}

		let rawValue;
		if (typeof value === 'boolean') {
			rawValue = value ? 1 : 0;
		} else if (value === undefined || value === null) {
			rawValue = '';
		}

		this.db
			.execute(`UPDATE todos SET ${cell} = $2 WHERE id = $1`, [rowId, rawValue])
			.then((result) => {
				if (result.rowsAffected > 0) {
					const row = this.todos.get(rowId);

					if (!row) {
						throw new Error(`Row ${rowId} not found`);
					}

					this.todos.set(rowId, { ...row, [cell]: value });
				} else {
					throw new Error(`Database update failed`);
				}
			})
			.catch(console.error);
	}

	deleteCell(rowId: string, cell: Cell) {
		if (!this.db) {
			throw new Error('Database not initialized');
		}

		this.db
			.execute(`UPDATE todos SET ${cell} = $2 WHERE id = $1`, [rowId, ''])
			.then((result) => {
				if (result.rowsAffected > 0) {
					const row = this.todos.get(rowId);

					if (!row) {
						throw new Error(`Row ${rowId} not found`);
					}

					this.todos.set(rowId, { ...row, [cell]: undefined });
				} else {
					throw new Error(`Database update failed`);
				}
			})
			.catch(console.error);
	}

	getRow(rowId: string): Todo | undefined {
		return this.todos.get(rowId);
	}

	setRow(id: string, data: Omit<Todo, 'id'>) {
		if (!this.db) {
			throw new Error('Database not initialized');
		}
		this.db
			.execute('INSERT INTO todos (id, text, done, date, created) VALUES ($1, $2, $3, $4, $5)', [
				id,
				data.text,
				data.done ? 1 : 0,
				data.date,
				data.created
			])
			.then((result) => {
				if (result.rowsAffected > 0) {
					this.todos.set(id, { id, ...data });
				} else {
					throw new Error(`Database insert failed`);
				}
			})
			.catch(console.error);
	}

	fillStore(data: TodoRow[]) {
		console.log(this.todos);
		for (const todo of data) {
			this.todos.set(todo.id, this.convertRow(todo));
		}
	}

	convertRow(row: TodoRow): Todo {
		return {
			...row,
			done: row.done === 1,
			date: new Date(row.date),
			created: new Date(row.created)
		};
	}
}

export default TauriStore;
