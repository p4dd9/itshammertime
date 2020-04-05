import IPosition from '../../interfaces/IPosition';
import IVelocity from '../../interfaces/IVelocity';

export default class HammerParticle {
	public id: number;
	public life = 0;
	public vxMultiplier = 20; // 0 === vertical spread origin distance
	public vyMultiplier = 20; // 0 === horizontal spread origin distance

	private context: CanvasRenderingContext2D;
	private position: IPosition;
	private velocity: IVelocity;
	private gravity: number;
	private particleSize: number;
	private color: string;
	private shape: string;

	constructor(
		context: CanvasRenderingContext2D,
		startPosition: IPosition,
		id: number,
		particleSize: number,
		gravity: number,
		color: string,
		shape: string
	) {
		this.context = context;
		this.position = startPosition;
		this.color = color;
		this.id = id;
		this.particleSize = particleSize;
		this.gravity = gravity;
		this.shape = shape;
		this.velocity = {
			vx: Math.random() * this.vxMultiplier - 10,
			vy: Math.random() * this.vyMultiplier - 5,
		};
	}

	public draw(): void {
		const { velocity, gravity, position } = this;
		position.x += velocity.vx;
		position.y += velocity.vy;

		velocity.vy += gravity;
		this.life++;

		if (this.shape === 'circle') {
			this.drawCircle();
		} else if (this.shape === 'square') {
			this.drawSquares();
		} else {
			this.drawStar();
		}
	}

	private drawCircle(): void {
		const { context, particleSize, color } = this;

		context.beginPath();
		context.fillStyle = color;

		context.arc(
			this.position.x,
			this.position.y,
			particleSize,
			0,
			Math.PI * 2,
			true
		);
		context.closePath();
		context.fill();
	}

	private drawSquares(): void {
		const { context, color } = this;
		context.fillStyle = color;
		context.fillRect(this.position.x, this.position.y, 20, 20);
		context.fill();
	}

	// https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
	private drawStar(spikes = 5, outerRadius = 15, innerRadius = 10): void {
		let rot = (Math.PI / 2) * 3;
		let x = this.position.x;
		let y = this.position.y;
		const step = Math.PI / spikes;
		const ctx = this.context;
		ctx.strokeStyle = '#000';
		ctx.beginPath();
		ctx.moveTo(this.position.x, this.position.y - outerRadius);
		for (let i = 0; i < spikes; i++) {
			x = this.position.x + Math.cos(rot) * outerRadius;
			y = this.position.y + Math.sin(rot) * outerRadius;
			ctx.lineTo(x, y);
			rot += step;

			x = this.position.x + Math.cos(rot) * innerRadius;
			y = this.position.y + Math.sin(rot) * innerRadius;
			ctx.lineTo(x, y);
			rot += step;
		}
		ctx.lineTo(this.position.x, this.position.y - outerRadius);
		ctx.closePath();
		ctx.lineWidth = 5;
		ctx.strokeStyle = this.color;
		ctx.stroke();
		ctx.fillStyle = this.color;
		ctx.fill();
	}
}
