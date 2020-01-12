import GameInput from './GameInput';
import LudeCat from './LudeCat';

export default class Game {
	public debugCanvas = true;

	private _context: CanvasRenderingContext2D;
	private _ludecat: LudeCat;
	private _gameInput: GameInput;

	constructor(context: CanvasRenderingContext2D) {
		this._context = context;
		this._ludecat = new LudeCat(this._context);
		this._gameInput = new GameInput(this._ludecat);
		this._step = this._step.bind(this);
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

	private drawCenterLines() {
		this._context.strokeStyle = '#f00';
		this._context.lineWidth = 2;
		this._context.strokeRect(
			this._context.canvas.width / 2,
			0,
			0,
			this._context.canvas.height
		);

		this._context.strokeRect(
			0,
			this._context.canvas.height / 2,
			this._context.canvas.width,
			0
		);
	}

	private _step() {
		// Check for controller input every drawn frame
		this._gameInput.handleInput();

		this.clearCanvas();

		// ACTUAL DRAWINGS
		if (this.debugCanvas) {
			this.drawCanvasBorder();
			this.drawCenterLines();
		}

		this._ludecat.draw();

		window.requestAnimationFrame(this._step);
	}

	public start() {
		window.requestAnimationFrame(this._step);
	}
}
