import Game from './Game';

export default class Debugger {
	public fps = '';

	private game: Game;
	private times: number[] = [];

	constructor(game: Game) {
		this.game = game;
	}

	public debug(): void {
		this.drawCanvasBorder();
		this.drawCenterLines();
		this.drawFPS();
	}

	private drawCanvasBorder(): void {
		const context = this.game.context;
		context.strokeStyle = '#f00';
		context.lineWidth = 2;
		context.strokeRect(0, 0, context.canvas.width, context.canvas.height);
	}

	private drawCenterLines(): void {
		const context = this.game.context;

		context.strokeStyle = '#f00';
		context.lineWidth = 2;
		context.strokeRect(
			context.canvas.width / 2,
			0,
			0,
			context.canvas.height
		);

		context.strokeRect(
			0,
			context.canvas.height / 2,
			context.canvas.width,
			0
		);
	}

	// Reference: https://www.growingwiththeweb.com/2017/12/fast-simple-js-fps-counter.html
	private calculateFPS(): void {
		const now = performance.now();
		while (this.times.length > 0 && this.times[0] <= now - 1000) {
			this.times.shift();
		}
		this.times.push(now);
		this.fps = String(this.times.length);
	}

	private drawFPS(): void {
		const context = this.game.context;
		this.calculateFPS();
		context.fillStyle = '#f00';
		context.font = '25px Arial';
		context.fillText(`${this.fps} fps`, context.canvas.width - 80, 30);
	}
}
