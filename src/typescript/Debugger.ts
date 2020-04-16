export default class Debugger {
	public context: CanvasRenderingContext2D;

	private color: string;
	private font: string;

	private fps = '';
	private times: number[] = [];

	constructor(
		context: CanvasRenderingContext2D,
		color = '#f00',
		font = '25px Arial'
	) {
		this.context = context;

		this.color = color;
		this.font = font;
	}

	public debug(): void {
		this.drawCanvasBorder();
		this.drawCenterLines();
		this.drawFPS();
	}

	private drawCanvasBorder(): void {
		this.context.strokeStyle = this.color;
		this.context.lineWidth = 2;
		this.context.strokeRect(
			0,
			0,
			this.context.canvas.width,
			this.context.canvas.height
		);
	}

	private drawCenterLines(): void {
		this.context.strokeStyle = this.color;
		this.context.lineWidth = 1;
		this.context.beginPath();
		this.context.moveTo(0, this.context.canvas.height * 0.5);
		this.context.lineTo(
			this.context.canvas.width,
			this.context.canvas.height * 0.5
		);
		this.context.moveTo(this.context.canvas.width * 0.5, 0);
		this.context.lineTo(
			this.context.canvas.width * 0.5,
			this.context.canvas.height
		);
		this.context.stroke();
	}

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
		this.context.fillStyle = this.color;
		this.context.font = this.font;
		this.context.fillText(
			`${this.fps} fps`,
			this.context.canvas.width - 80,
			30
		);
	}
}
