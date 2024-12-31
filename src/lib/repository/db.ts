import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db';
import { createQueries, createStore } from 'tinybase/with-schemas';

export const db = createStore().setTablesSchema({
	todos: {
		text: { type: 'string' },
		done: { type: 'boolean' },
		date: { type: 'string', default: undefined },
		created: { type: 'string' }
	}
});
// .setTable('todos', {
// 	'0001': {
// 		text: 'Learn SvelteKit',
// 		done: false,
// 		date: new Date().toISOString(),
// 		created: '2023-01-01'
// 	},
// 	'0002': {
// 		text: 'Learn LightningCSS',
// 		done: false,
// 		date: new Date().toISOString(),
// 		created: '2023-01-02'
// 	}
// })

const queries = createQueries(db);
const persister = createIndexedDbPersister(db, 'todos');

persister.startAutoLoad().catch(console.error);
persister.startAutoSave().catch(console.error);

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
