import {
	addRxPlugin,
	createRxDatabase,
	toTypedRxJsonSchema,
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	type MangoQuery,
	type RxCollection,
	type RxDocument,
	type RxJsonSchema
} from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

addRxPlugin(RxDBDevModePlugin);

const todoSchemaLiteral = {
	version: 0,
	primaryKey: 'id',
	type: 'object',
	properties: {
		id: {
			type: 'string',
			maxLength: 100
		},
		text: {
			type: 'string'
		},
		done: {
			type: 'boolean'
		},
		date: {
			type: ['string', 'null'],
			format: 'date-time'
		},
		created: {
			type: 'string',
			format: 'date-time',
			final: true
		}
	},
	required: ['id', 'text', 'done', 'date', 'created']
} as const;

const schemaTyped = toTypedRxJsonSchema(todoSchemaLiteral);

export type TodoDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

export const todoSchema: RxJsonSchema<TodoDocType> = schemaTyped;

export type TodoDocument = RxDocument<TodoDocType>;

export type TodoCollection = RxCollection<TodoDocType>;

export type TodoDatabaseCollections = {
	todos: TodoCollection;
};

export const db = await createRxDatabase<TodoDatabaseCollections>({
	name: 'todos',
	storage: getRxStorageDexie()
});

await db.addCollections({
	todos: {
		schema: todoSchema
	}
});

export const allTodos: MangoQuery<TodoDocType> = {
	selector: {}
};
