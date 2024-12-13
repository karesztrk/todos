import * as S from '@effect/schema/Schema';
import {
	NonEmptyString1000,
	SqliteBoolean,
	SqliteDate,
	cast,
	database,
	id,
	table,
	type QueryResult
} from '@evolu/common';
import { createEvolu } from '@evolu/common-web';

type NullableExceptIdCreatedAtUpdatedAt<T> = {
	readonly [K in keyof T]: K extends 'id' | 'createdAt' | 'updatedAt' ? T[K] : T[K] | null;
};

export const TodoId = id('Todo');

export type TodoId = typeof TodoId.Type;

export const TodoTable = table({
	id: TodoId,
	text: NonEmptyString1000,
	date: S.NullOr(SqliteDate),
	done: S.NullOr(SqliteBoolean)
});

export type TodoTable = typeof TodoTable.Type;

export const Database = database({
	todo: TodoTable
});

type Database = typeof Database.Type;

export type TodoRows = QueryResult<NullableExceptIdCreatedAtUpdatedAt<TodoTable>>;

export type TodoRow = TodoRows['row'];

export const db = createEvolu(Database);
export const allTodos = ({ start, end }: { start: Date; end: Date }) =>
	db.createQuery((db) =>
		db
			.selectFrom('todo')
			.selectAll()
			.where('isDeleted', 'is not', cast(true))
			.where((eb) => {
				const filters = [];

				filters.push(eb('date', '>=', cast(start)));

				filters.push(eb('date', '<=', cast(end)));

				return eb.and(filters).or('date', 'is', null);
			})
	);
