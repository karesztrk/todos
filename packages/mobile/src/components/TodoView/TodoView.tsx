// import { type Todo as TodoType } from '$lib/repository/db';
// import TodoList from '../TodoList';
// import TodoViewState from './TodoViewState.svelte';
// import Todo from '../Todo';
import { v4 as uuid } from '@lukeed/uuid';
// import TodoDialog from '../TodoDialog/TodoDialog.svelte';
// import { setViewContext } from './TodoViewContext.svelte';
// import { getStoreContext } from '$lib/repository/context';
import type { Todo as TodoType } from '../../lib/repository/index.js';
import { useEffect, type FC } from '@lynx-js/react';
import useTodoViewState from './useTodoViewState.js';
import TodoList from '../TodoList/TodoList.js';
import Todo from '../Todo/index.js';

interface Props {
  todos: TodoType[];
  range: { start: Date; end: Date };
}

const TodoView: FC<Props> = ({ todos = [], range }) => {
  useEffect(() => {
    // const active = document.querySelector('t-list[active]');
    // let timeout: number;
    // if (active) {
    // 	timeout = setTimeout(() => {
    // 		active.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    // 	}, 100);
    // }
    // return () => {
    // 	storeContext.cleanup();
    // 	if (timeout) {
    // 		clearTimeout(timeout);
    // 	}
    // };
  }, []);

  const viewState = useTodoViewState({ todos, range });

  const onSubmit = (date?: Date) => (e: SubmitEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const values = new FormData(target, e.submitter);
    const text = values.get('text') as string | null;
    if (text) {
      // storeContext.setRow(uuid(), {
      // 	done: false,
      // 	text,
      // 	date: date?.toDateString(),
      // 	created: new Date().toISOString()
      // });
      target.reset();
    }
  };

  const onInput = (e: Event) => {
    (e?.currentTarget as HTMLElement)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'nearest',
    });
  };

  return (
    <view className="t-view">
      {viewState.getWeekDays().map(({ d, date, name, today }) => (
        <view key={date} /*onsubmit={onSubmit(d)}*/>
          <TodoList active={today} header={<text class="bold">{date}</text>}>
            <text class="light">{name}</text>
            {viewState.list(d).map((todo) => (
              <Todo key={todo.id} todo={todo} />
            ))}
            {/* <input type="text" name="text" /> */}
          </TodoList>
        </view>
      ))}

      {/*
	  <form onsubmit={onSubmit()}>
	 	<view class="someday">
	 		{#snippet header()}<div class="bold">Someday</div>{/snippet}
	 		{#each viewState.list() as todo (todo.id)}
	 			<Todo {todo} />
	 		{/each}
	 		<input type="text" name="text" oninput={onInput} />
	 	</TodoList>
	 </form>
	 <TodoDialog />
*/}
    </view>
  );
};

export default TodoView;
