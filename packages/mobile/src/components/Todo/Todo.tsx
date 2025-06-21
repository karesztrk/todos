// import buttonSound from '../../../sounds/button-6.mp3';
import type { Todo as TodoType } from '../../lib/repository/index.js';
import { useRef, useState, type FC } from '@lynx-js/react';
import { useTodoViewStore } from '../TodoView/TodoViewContext.js';

interface Props {
  todo: TodoType;
}

const Todo: FC<Props> = ({ todo }) => {
  const [checked, setChecked] = useState(todo?.done || false);
  const element = useRef(null);
  // let audio = $state<HTMLAudioElement>();

  const viewContext = useTodoViewStore();

  const elasticEasing =
    'linear(0, 0.03 1.5%, 0.121 3.2%, 0.851 13%, 0.99 16.4%, 1.063 20.2%, 1.076 22.3%, 1.075 24.8%, 1.013 35.9%, 0.995 43.4%, 1)';

  const onChange = () => {
    if (todo === null) {
      return;
    }
    const done = checked;
    setChecked(done);
  };

  const onClick = () => {
    viewContext.selectTodo(todo.id);
  };

  return (
    <view
      className="t-todo"
      ref={element}
      data-done={todo?.done ? '' : undefined}
      style={{ '--transition-easing': elasticEasing }}
    >
      {todo !== null && <view bindtap={onClick}>{todo.text}</view>}
      <view bindtap={onChange}>{checked ? '✅' : '❌'}</view>

      {/* <audio bind:this={audio} src={buttonSound} controls></audio> */}
    </view>
  );
};
export default Todo;
