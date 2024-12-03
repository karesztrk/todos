class Todo {
	date;
	done = $state(false);
	text = $state('');

	constructor(text: string, date?: Date) {
		this.text = text;
		this.date = date;
	}

	reset() {
		this.text = '';
		this.done = false;
	}
}

export default Todo;
