import { createQueries, createStore } from 'tinybase/with-schemas';
import Database from '@tauri-apps/plugin-sql';
import { createCustomPersister } from 'tinybase/persisters/with-schemas';

export const db = createStore().setTablesSchema({
	todos: {
		text: { type: 'string' },
		done: { type: 'boolean' },
		date: { type: 'string', default: undefined },
		created: { type: 'string' }
	}
});

const storeJson = '';
let interval: number;

export const persister = createCustomPersister(
	db,
	async () => {
		try {
			const database = await Database.load('sqlite:db.sqlite');
			const res = await database.select<Todo>('SELECT * FROM todo ORDER BY created DESC');

			console.log(res);

			return res;
		} catch {}
	},
	async (getContent) => {
		for (const t of getContent()) {
			const todos = t.todos;
			if (todos) {
				const database = await Database.load('sqlite:db.sqlite');
				for (const key in todos) {
					const todo = todos[key];

					const result = await database.execute(
						'INSERT into todo (id, text, done, date, created) VALUES ($1, $2, $3, $4, $5)',
						[key, todo.text, todo.done, todo.date, todo.created]
					);
				}
			}
		}

		const database = await Database.load('sqlite:db.sqlite');
		// const result = await database.execute('INSERT into todos (id, title, status) VALUES ($1, $2, $3)', [
		// 	todo.id,
		// 	todo.text,
		// 	todo.done,
		//      todo.todos
		// ]);
	},
	(listener: TimerHandler) => (interval = setInterval(listener, 1000)),
	() => clearInterval(interval)
);
persister
	.startAutoLoad()
	.then(() => {})
	.catch((e) => console.error(e));
persister
	.startAutoSave()
	.then(() => {})
	.catch((e) => console.error(e));

const queries = createQueries(db);

export interface Todo {
	id: string;
	text: string;
	done: boolean;
	date?: Date;
	created: string;
}

queries.setQueryDefinition('query', 'todos', ({ select }) => {
	select('text');
	select('done');
	select('date');
	select('created');
});

export const getAllTodos = (): Todo[] => {
	return queries
		.getResultSortedRowIds('query', 'created', true)
		.map((rowId) => ({ ...queries.getResultRow('query', rowId), id: rowId }) as Todo)
		.map((row) => ({
			...row,
			date: typeof row.date === 'string' ? new Date(row.date) : undefined
		}));
};
