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
		this.game.context.strokeStyle = '#f00';
		this.game.context.lineWidth = 2;
		this.game.context.strokeRect(
			0,
			0,
			this.game.context.canvas.width,
			this.game.context.canvas.height
		);
	}

	private drawCenterLines(): void {
		this.game.context.strokeStyle = '#f00';
		this.game.context.lineWidth = 2;
		this.game.context.strokeRect(
			this.game.context.canvas.width / 2,
			0,
			0,
			this.game.context.canvas.height
		);

		this.game.context.strokeRect(
			0,
			this.game.context.canvas.height / 2,
			this.game.context.canvas.width,
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
		this.calculateFPS();
		this.game.context.fillStyle = '#f00';
		this.game.context.font = '25px Arial';
		this.game.context.fillText(
			`${this.fps} fps`,
			this.game.context.canvas.width - 80,
			30
		);
	}
}
