import { create } from 'zustand';
import type { Todo } from '../../lib/repository/index.js';

type State = {
  selectedTodo: Todo['id'] | null;
};

type Action = {
  selectTodo: (id: Todo['id']) => void;
};

export const useTodoViewStore = create<State & Action>((set) => ({
  selectedTodo: null,
  selectTodo: (id) => set(() => ({ selectedTodo: id })),
}));
