<script lang="ts">
	import { Either } from 'effect';
	import * as S from '@effect/schema/Schema';
	import { NonEmptyString1000 } from '@evolu/common';
	import { db, type TodoRows, allTodos, TodoId } from '$lib/repository/db';

	const { todos: todosProp }: { todos: TodoRows } = $props();

	let todos = $state(todosProp);

	$effect(() => {
		const unsubscribe = db.subscribeQuery(allTodos)(() => {
			const result = db.getQuery(allTodos);
			todos = result;
		});
		return () => {
			unsubscribe();
		};
	});

	const onKeydown = () => (e: KeyboardEvent) => {
		const target = e.target as HTMLInputElement;
		const text = S.decodeUnknownEither(NonEmptyString1000)(target.value);
		if (e.key === 'Enter' && Either.isRight(text)) {
			db.create('todo', { done: false, text: text.right });
			target.value = '';
		}
	};

	const onDelete = (id: TodoId) => () => {
		db.update('todo', { id, isDeleted: true });
	};
</script>

<t-view>
	<ul>
		{#each todos.rows as todo}
			<li>
				{todo.text}
				{todo.done}
			</li>
			<button onclick={onDelete(todo.id)}>Delete</button>
		{/each}
	</ul>
	<input type="text" name="text" onkeydown={onKeydown()} />
</t-view>
