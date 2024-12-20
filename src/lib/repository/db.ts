import Dexie, { type EntityTable } from 'dexie';

interface Todo {
	id: string;
	text: string;
	done: boolean;
	date?: Date;
	created: Date;
}

const db = new Dexie('TodosDatabase') as Dexie & {
	todos: EntityTable<Todo, 'id'>;
};

db.version(1).stores({
	todos: '++id, text, done, date, created'
});

export type { Todo };
export { db };
