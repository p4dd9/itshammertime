import GameInput from './GameInput';
import LudeCat from './LudeCat';

export default class Game {
	public debug: boolean = true;

	private _context: CanvasRenderingContext2D;
	private _ludecat: LudeCat;
	private _gameInput: GameInput;

	private _times: number[] = [];
	public fps: string = '';

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

	// Reference: https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html
	private calculateFPS() {
		const now = performance.now();
		while (this._times.length > 0 && this._times[0] <= now - 1000) {
			this._times.shift();
		}
		this._times.push(now);
		this.fps = String(this._times.length);
	}

	private drawFPS() {
		this.calculateFPS();
		this._context.fillStyle = '#f00';
		this._context.font = '25px Arial';
		this._context.fillText(
			`${this.fps} fps`,
			this._context.canvas.width - 80,
			30
		);
	}

	private _step() {
		// Check for controller input every drawn frame
		this._gameInput.handleInput();

		this.clearCanvas();

		// ACTUAL DRAWINGS
		if (this.debug) {
			this.drawCanvasBorder();
			this.drawCenterLines();
			this.drawFPS();
		}

		this._ludecat.draw();

		window.requestAnimationFrame(this._step);
	}

	public start() {
		window.requestAnimationFrame(this._step);
	}
}
