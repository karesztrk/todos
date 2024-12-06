import { CoMap, co } from 'jazz-tools';

class TodoState extends CoMap {
	date = co.optional.Date;
	done = co.boolean;
	text = co.string;

	reset() {
		this.text = '';
		this.done = false;
	}
}

export default TodoState;
