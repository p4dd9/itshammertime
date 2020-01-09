import Controller from './Controller';
import LudeCat from './LudeCat';

export default class Game {
	public context: CanvasRenderingContext2D;
	public ludecat: LudeCat;
	public controller: Controller;

	constructor(context: CanvasRenderingContext2D) {
		this.context = context;
		this.ludecat = new LudeCat(this.context);
		this.controller = new Controller(this.ludecat);
		this.step = this.step.bind(this);
	}

	public resize(canvasWidth: number, canvasHeight: number) {
		this.context.canvas.width = canvasWidth;
		this.context.canvas.height = canvasHeight;

		this.ludecat.resizeCanvas(canvasWidth, canvasHeight);
	}

	private clearCanvas() {
		this.context.clearRect(
			0,
			0,
			this.context.canvas.width,
			this.context.canvas.height
		);
	}
	private _frameSpeed = 0;

	private step() {
		// Check for controller input every drawn frame
		this.controller.handleControllerInput();

		this._frameSpeed++;
		if (this._frameSpeed < 4) {
			window.requestAnimationFrame(this.step);
			return;
		}
		this.clearCanvas();
		this._frameSpeed = 0;

		// ACTUAL DRAWINGS
		this.ludecat.draw();

		window.requestAnimationFrame(this.step);
	}

	public async start() {
		window.requestAnimationFrame(this.step);
	}
}
