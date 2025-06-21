import { useState } from '@lynx-js/react';
import { addDays as addDaysFns } from '../../util/date.js';

const useTodoRange = ({
  start: startProp,
  days,
}: { start: Date; days: number }) => {
  const [start, setStart] = useState(startProp);
  const [end, setEnd] = useState(addDaysFns(start, days ?? 7));

  const addDays = (days: number) => {
    setStart(addDaysFns(start, days));
    setEnd(addDaysFns(end, days));
  };

  return {
    addDays,
  };
};

export default useTodoRange;
