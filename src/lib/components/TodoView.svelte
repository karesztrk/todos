<script lang="ts">
	import { Either } from 'effect';
	import * as S from '@effect/schema/Schema';
	import { NonEmptyString1000, SqliteBoolean, cast, database, id, table } from '@evolu/common';
	import { createEvolu } from '@evolu/common-web';

	const TodoId = id('Todo');

	const TodoTable = table({
		id: TodoId,
		text: NonEmptyString1000,
		done: S.NullOr(SqliteBoolean)
	});

	const Database = database({
		todo: TodoTable
	});

	const evolu = createEvolu(Database);

	const allTodos = evolu.createQuery((db) =>
		db
			.selectFrom('todo')
			.selectAll()
			// SQLite doesn't support the boolean type, but we have `cast` helper.
			.where('done', 'is not', cast(true))
			.orderBy('createdAt')
	);

	evolu.loadQuery(allTodos).then((a) => console.log(a));

	const todos = $state(evolu.loadQuery(allTodos));

	const onKeydown = (date?: Date) => (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;
		const text = S.decodeUnknownEither(NonEmptyString1000)(target.value);
		if (e.key === 'Enter' && Either.isRight(text)) {
			evolu.create('todo', { done: false, text: text.right });
			target.value = '';
		}
		// const todo = new TodoState(text, date);
		// viewState.push(todo);
	};
</script>

<t-view>
	{#await todos}
		<div>Loading...</div>
	{:then todos}
		<ul>
			{#each todos.rows as todo}
				<li>
					{todo.id}
					{todo.text}
					{todo.done}
					{todo.createdAt}
				</li>
			{/each}
		</ul>
		<input type="text" name="text" onkeydown={onKeydown()} />
	{:catch error}
		<!-- promise was rejected -->
		<p>Something went wrong: {error.message}</p>
	{/await}
</t-view>
