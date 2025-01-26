const CLOSED_OFFSET = 110;
const OPEN_OFFSET = 0;
const HALF_OFFSET = CLOSED_OFFSET / 2;
class ModalDragState {
	#dragging = $state(false);
	#offset = $state(CLOSED_OFFSET);
	#initialY = $state(0);

	constructor() {}

	open() {
		this.#offset = OPEN_OFFSET;
	}

	close() {
		this.#offset = CLOSED_OFFSET;
	}

	start(y: number) {
		this.#dragging = true;
		this.#initialY = y;
	}

	stop(state: 'open' | 'close') {
		this.#dragging = false;
		this.#initialY = 0;
		switch (state) {
			case 'open':
				this.open();
				break;
			case 'close':
				this.close();
				break;
			default:
				break;
		}
	}

	drag(y: number, element: HTMLElement) {
		const delta = Math.max(0, y - this.#initialY);
		const height = element.clientHeight;
		this.#offset = Math.ceil(Math.max(0, delta / height) * 100);
	}

	isCloseHeightReached = () => this.#offset > HALF_OFFSET;

	get dragging() {
		return this.#dragging;
	}

	get current() {
		return this.#offset;
	}
}

export default ModalDragState;
