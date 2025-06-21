import { isToday, weekDays } from '../../util/date.js';
import type { Todo } from '../../lib/repository/index.js';
import { useState } from '@lynx-js/react';

const dateFormatter = new Intl.DateTimeFormat('en', {
  month: '2-digit',
  day: '2-digit',
});

const dayFormatter = new Intl.DateTimeFormat('en', {
  weekday: 'short',
});

export interface WeekDay {
  d: Date;
  date: string;
  name: string;
  today: boolean;
}

interface Range {
  start: Date;
  end: Date;
}

const sort = (left: Todo, right: Todo): number => {
  return new Date(left.created).getTime() - new Date(right.created).getTime();
};

const pushAll = (map: Map<string, Todo[]>, todos: Todo[]) => {
  for (const todo of todos) {
    push(map, todo);
  }
  return map;
};

const push = (map: Map<string, Todo[]>, todo: Todo) => {
  const key = todo?.date
    ? dateFormatter.format(new Date(todo.date))
    : 'someday';
  const todos = map.get(key) ?? [];
  map.set(key, [...todos, todo].sort(sort));
  return map;
};

const useTodoViewState = ({
  todos: todosProp,
  range: rangeProp,
}: {
  todos: Todo[];
  range: Range;
}) => {
  const [todos, setTodos] = useState<Map<string, Todo[]>>(
    pushAll(new Map(), todosProp),
  );

  const [range, setRange] = useState<Range>(rangeProp);

  const getWeekDays = (): WeekDay[] => {
    return weekDays(range.start).map((d) => ({
      d,
      date: dateFormatter.format(d),
      name: dayFormatter.format(d),
      today: isToday(d),
    }));
  };

  const list = (date?: Date) => {
    const key = date ? dateFormatter.format(date) : 'someday';
    return todos.get(key) ?? [];
  };

  return {
    list,
    getWeekDays,
  };
};

export default useTodoViewState;
