import Game from './Game';

export default class Debugger {
	private _game: Game;

	private _times: number[] = [];
	public fps: string = '';

	constructor(game: Game) {
		this._game = game;
	}

	public debug() {
		this.drawCanvasBorder();
		this.drawCenterLines();
		this.drawFPS();
	}

	private drawCanvasBorder() {
		this._game.context.strokeStyle = '#f00';
		this._game.context.lineWidth = 2;
		this._game.context.strokeRect(
			0,
			0,
			this._game.context.canvas.width,
			this._game.context.canvas.height
		);
	}

	private drawCenterLines() {
		this._game.context.strokeStyle = '#f00';
		this._game.context.lineWidth = 2;
		this._game.context.strokeRect(
			this._game.context.canvas.width / 2,
			0,
			0,
			this._game.context.canvas.height
		);

		this._game.context.strokeRect(
			0,
			this._game.context.canvas.height / 2,
			this._game.context.canvas.width,
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
		this._game.context.fillStyle = '#f00';
		this._game.context.font = '25px Arial';
		this._game.context.fillText(
			`${this.fps} fps`,
			this._game.context.canvas.width - 80,
			30
		);
	}
}
