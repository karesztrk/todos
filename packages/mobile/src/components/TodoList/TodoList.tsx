import type { FC, PropsWithChildren, ReactNode } from '@lynx-js/react';

interface Props extends PropsWithChildren {
  active?: boolean;
  header: ReactNode;
  class?: string;
}

const TodoList: FC<Props> = ({
  active,
  children,
  header,
  class: className,
}) => {
  return (
    <view
      className="t-list"
      data-active={active ? '' : undefined}
      class={className}
    >
      <view class="t-header">{header}</view>
      {children}
    </view>
  );
};

export default TodoList;
