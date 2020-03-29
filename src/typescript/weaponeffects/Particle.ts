import IPosition from '../../interfaces/IPosition';
import IVelocity from '../../interfaces/IVelocity';

export default class Particle {
	private context: CanvasRenderingContext2D;
	private position: IPosition;
	private velocity: IVelocity;
	public id: number;
	public life = 0;
	public maxLife: number;
	private gravity = 0.5;
	private particleSize: number;

	constructor(
		context: CanvasRenderingContext2D,
		startPosition: IPosition,
		id: number,
		particleSize: number,
		maxLife: number
	) {
		this.context = context;
		this.position = startPosition;
		this.id = id;
		this.maxLife = maxLife;
		this.particleSize = particleSize;
		this.velocity = {
			vx: Math.random() * 20 - 10,
			vy: Math.random() * 20 - 5,
		};
	}

	public draw(): void {
		this.position.x += this.velocity.vx;
		this.position.y += this.velocity.vy;

		this.velocity.vy += this.gravity;
		this.life++;

		this.context.beginPath();
		this.context.fillStyle = '#ffffff';

		this.context.arc(
			this.position.x,
			this.position.y,
			this.particleSize,
			0,
			Math.PI * 2,
			true
		);
		this.context.closePath();
		this.context.fill();
	}
}
