import Dexie, { type EntityTable } from 'dexie';
import dexieCloud from 'dexie-cloud-addon';
import { PUBLIC_DB_URL } from '$env/static/public';

interface Todo {
	id: string;
	text: string;
	done: boolean;
	date?: Date;
	created: Date;
}

const db = new Dexie('TodosDatabase', { addons: [dexieCloud] }) as Dexie & {
	todos: EntityTable<Todo, 'id'>;
};

db.version(1).stores({
	todos: '@id, text, done, date, created'
});

db.cloud.configure({
	databaseUrl: PUBLIC_DB_URL,
	requireAuth: true
});

export type { Todo };
export { db };
