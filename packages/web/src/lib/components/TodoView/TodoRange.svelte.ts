import { addDays } from './TodoView.util';

class TodoRange {
	start = $state(new Date());
	end = $state(new Date());

	constructor(start: Date, days?: number) {
		this.start = start;
		this.end = addDays(start, days ?? 7);
	}

	addDays(days: number) {
		this.start = addDays(this.start, days);
		this.end = addDays(this.end, days);
	}
}

export default TodoRange;
