import IPosition from '../interfaces/IPosition';

export default class CanvasCursor {
	private _mousePosition: IPosition;
	private _context: CanvasRenderingContext2D;

	constructor(context: CanvasRenderingContext2D) {
		this._context = context;

		this._mousePosition = {
			x: 0,
			y: 0,
		};

		this.addCursorListenerToDocument();
	}

	get mousePosition(): IPosition {
		return this._mousePosition;
	}

	set mousePosition(mousePosition: IPosition) {
		this._mousePosition = mousePosition;
	}

	private getMousePos(event: MouseEvent): IPosition {
		const rect = this._context.canvas.getBoundingClientRect();

		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top,
		};
	}

	private addCursorListenerToDocument(): void {
		document.addEventListener('mousemove', event => {
			this.mousePosition = this.getMousePos(event as MouseEvent);
		});
	}
}
