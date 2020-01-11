import Controller from './Controller';
import LudeCat from './LudeCat';

export default class Game {
	private _context: CanvasRenderingContext2D;
	private _ludecat: LudeCat;
	private _controller: Controller;

	constructor(context: CanvasRenderingContext2D) {
		this._context = context;
		this._ludecat = new LudeCat(this._context);
		this._controller = new Controller(this._ludecat);
		this.step = this.step.bind(this);
	}

	public resize(canvasWidth: number, canvasHeight: number) {
		this._context.canvas.width = canvasWidth;
		this._context.canvas.height = canvasHeight;

		this._ludecat.resizeCanvas(canvasWidth, canvasHeight);
	}

	private clearCanvas() {
		this._context.clearRect(
			0,
			0,
			this._context.canvas.width,
			this._context.canvas.height
		);
	}

	private drawCanvasBorder() {
		this._context.strokeStyle = '#f00';
		this._context.lineWidth = 2;
		this._context.strokeRect(
			0,
			0,
			this._context.canvas.width,
			this._context.canvas.height
		);
	}

	private step() {
		// Check for controller input every drawn frame
		this._controller.handleInput();

		this.clearCanvas();

		// ACTUAL DRAWINGS
		this.drawCanvasBorder();
		this._ludecat.draw();

		window.requestAnimationFrame(this.step);
	}

	public start() {
		window.requestAnimationFrame(this.step);
	}
}
