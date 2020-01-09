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

	private drawCanvasBorder() {
		this.context.strokeStyle = '#f00';
		this.context.lineWidth = 2;
		this.context.strokeRect(
			0,
			0,
			this.context.canvas.width,
			this.context.canvas.height
		);
	}

	private step() {
		// Check for controller input every drawn frame
		this.controller.handleInput();

		this.clearCanvas();

		// ACTUAL DRAWINGS
		this.drawCanvasBorder();
		this.ludecat.draw();

		window.requestAnimationFrame(this.step);
	}

	public start() {
		window.requestAnimationFrame(this.step);
	}
}
