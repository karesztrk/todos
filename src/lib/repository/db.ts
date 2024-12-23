import { createQueries, createStore, type Id } from 'tinybase/with-schemas';
import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db';

export const db = createStore().setTablesSchema({
	todos: {
		text: { type: 'string' },
		done: { type: 'boolean' },
		date: { type: 'string', default: undefined },
		created: { type: 'string' }
	}
});

export type TodoTable = { [rowId: Id]: TodoRow };

export interface TodoRow {
	text: string;
	done: boolean;
	date?: Date;
	created: string;
}

const persister = createIndexedDbPersister(db, 'todos/todoStore');
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
