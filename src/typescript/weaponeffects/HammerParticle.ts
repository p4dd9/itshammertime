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

	constructor(
		context: CanvasRenderingContext2D,
		startPosition: IPosition,
		id: number,
		particleSize: number,
		gravity: number,
		color: string
	) {
		this.context = context;
		this.position = startPosition;
		this.color = color;
		this.id = id;
		this.particleSize = particleSize;
		this.gravity = gravity;
		this.velocity = {
			vx: Math.random() * this.vxMultiplier - 10,
			vy: Math.random() * this.vyMultiplier - 5,
		};
	}

	public draw(): void {
		const {
			context,
			position,
			velocity,
			particleSize,
			gravity,
			color,
		} = this;
		position.x += velocity.vx;
		position.y += velocity.vy;

		velocity.vy += gravity;
		this.life++;

		context.beginPath();
		context.fillStyle = color;

		context.arc(position.x, position.y, particleSize, 0, Math.PI * 2, true);
		context.closePath();
		context.fill();
	}
}
