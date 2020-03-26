import ICursorPosition from '../interfaces/ICursor';

export default class GameCursor {
	private _mousePosition: ICursorPosition;
	private _context: CanvasRenderingContext2D;

	constructor(context: CanvasRenderingContext2D) {
		this._context = context;

		this._mousePosition = {
			x: 0,
			y: 0,
		};

		this.addCursorListenerToDocument();
	}

	get mousePosition(): ICursorPosition {
		return this._mousePosition;
	}

	set mousePosition(mousePosition: ICursorPosition) {
		console.log(mousePosition);
		this._mousePosition = mousePosition;
	}

	private getMousePos(event: MouseEvent): ICursorPosition {
		const rect = this._context.canvas.getBoundingClientRect();

		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	}

	private addCursorListenerToDocument() {
		document.addEventListener('mousemove', event => {
			this.mousePosition = this.getMousePos(event as MouseEvent);
		});
	}
}
