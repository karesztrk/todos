import { createIndexedDbPersister } from 'tinybase/persisters/persister-indexed-db/with-schemas';
import {
	createQueries,
	createStore,
	type NoValuesSchema,
	type Queries,
	type Store as SchemaStore,
	type TablesSchema
} from 'tinybase/with-schemas';

export interface Todo {
	id: string;
	text: string;
	done: boolean;
	date?: Date;
	created: string;
}

const schema = {
	todos: {
		text: { type: 'string' },
		done: { type: 'boolean' },
		date: { type: 'string', default: undefined },
		created: { type: 'string' }
	}
} as const satisfies TablesSchema;

export type Cell = keyof (typeof schema)['todos'];

export interface BasicStore {
	getAllTodos(): Todo[];

	setCell(rowId: string, cell: Cell, value: any): void;

	deleteCell(rowId: string, cellId: Cell): void;

	getRow(rowId: string): any;

	setRow(id: string, data: Record<string, any>): void;
}

class Store implements BasicStore {
	store: SchemaStore<[typeof schema, NoValuesSchema]>;
	queries: Queries<[typeof schema, NoValuesSchema]>;

	constructor() {
		this.store = createStore().setTablesSchema(schema);

		this.queries = createQueries(this.store);
		const persister = createIndexedDbPersister(this.store, 'todos');

		persister.startAutoLoad().catch(console.error);
		persister.startAutoSave().catch(console.error);

		this.queries.setQueryDefinition('query', 'todos', ({ select }) => {
			select('text');
			select('done');
			select('date');
			select('created');
		});
	}

	getAllTodos(): Todo[] {
		return this.queries
			.getResultSortedRowIds('query', 'created', true)
			.map((rowId) => ({ ...this.queries.getResultRow('query', rowId), id: rowId }) as Todo)
			.map((row) => ({
				...row,
				date: typeof row.date === 'string' ? new Date(row.date) : undefined
			}));
	}

	setCell(rowId: string, cell: Cell, value: any) {
		this.store.setCell('todos', rowId, cell, value);
	}

	deleteCell(rowId: string, cellId: Cell) {
		this.store.delCell('todos', rowId, cellId);
	}

	getRow(rowId: string) {
		return this.store.getRow('todos', rowId);
	}

	setRow(id: string, data: Record<string, any>) {
		this.store.setRow('todos', id, data);
	}
}

export default Store;
