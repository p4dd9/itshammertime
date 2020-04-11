import IPosition from '../../interfaces/IPosition';
import IVelocity from '../../interfaces/IVelocity';

export default class HammerParticle {
	public id: number;
	public life = 0;

	private context: CanvasRenderingContext2D;
	private position: IPosition;
	private velocity: IVelocity;
	private gravity: number;
	private size: number;
	private color: string;
	private shape: string;

	constructor(
		context: CanvasRenderingContext2D,
		startPosition: IPosition,
		id: number,
		particleSize: number,
		gravity: number,
		color: string,
		shape: string,
		vxMultiplier: number,
		vyMultiplier: number
	) {
		this.context = context;
		this.position = startPosition;
		this.color = color;
		this.id = id;
		this.size = particleSize;
		this.gravity = gravity;
		this.shape = shape;
		this.velocity = {
			vx: Math.random() * vxMultiplier - 10,
			vy: Math.random() * vyMultiplier - 5,
		};
	}

	public draw(): void {
		this.position = { 
			x: this.position.x + this.velocity.vx,
			y: this.position.y + this.velocity.vy,
		}

		this.velocity.vy += this.gravity;
		this.life++;

		if (this.shape === 'splitter') {
			this.drawSplitter();
		} else if (this.shape === 'square') {
			this.drawSquares();
		} else {
			this.drawStar();
		}
	}

	private drawSplitter(): void {
		this.context.beginPath();

		const grd = this.context.createLinearGradient(
			this.position.x,
			this.position.y,
			this.position.x + this.size,
			this.position.y
		);
		grd.addColorStop(0.1, 'white');
		grd.addColorStop(1, '#66A0D0');

		this.context.fillStyle = grd;

		this.context.moveTo(this.position.x, this.position.y);
		this.context.lineTo(this.position.x, this.position.y + this.size * 2);
		this.context.lineTo(
			this.position.x + this.size * 2,
			this.position.y + this.size * 2
		);

		this.context.closePath();
		this.context.fill();
	}

	private drawSquares(): void {
		this.context.fillStyle = this.color;
		this.context.fillRect(
			this.position.x,
			this.position.y,
			this.size,
			this.size
		);
		this.context.fill();
	}

	// https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5
	private drawStar(spikes = 5, outerRadius = 15, innerRadius = 7): void {
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
