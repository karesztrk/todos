import type { Todo } from '$lib/repository/db';
import { getContext, setContext } from 'svelte';

class TodoViewContext {
	selectedTodo = $state<Todo['id']>();
}

const key = Symbol('view');

export const getViewContext = (): TodoViewContext => getContext(key);

export const setViewContext = () => {
	setContext(key, new TodoViewContext());
};

export default TodoViewContext;
