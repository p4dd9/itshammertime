import IPosition from '../../interfaces/IPosition';
import IVelocity from '../../interfaces/IVelocity';

import LeafImage from '../../assets/images/leaf.png';

export default class HammerParticle {
	public id: number;
	public life = 0;

	private context: CanvasRenderingContext2D;
	private position: IPosition;
	private velocity: IVelocity;
	private gravity: number;
	private size: number;
	private theme: string | string[];
	private color: string | CanvasGradient;
	private shape: string;

	private leafImage = new Image();

	constructor(
		context: CanvasRenderingContext2D,
		startPosition: IPosition,
		id: number,
		particleSize: number,
		gravity: number,
		theme: string | string[],
		shape: string,
		vxMultiplier: number,
		vyMultiplier: number
	) {
		this.context = context;
		this.position = startPosition;
		this.theme = theme;
		this.id = id;
		this.size = particleSize;
		this.gravity = gravity;
		this.color = this.setColorAndFillStyles();
		this.shape = shape;
		this.leafImage.src = LeafImage;
		this.velocity = {
			vx: Math.random() * vxMultiplier - 10,
			vy: Math.random() * vyMultiplier - 5,
		};
	}

	private setColorAndFillStyles(): CanvasGradient | string {
		if (Array.isArray(this.theme)) {
			const grd = this.context.createLinearGradient(
				this.position.x,
				this.position.y,
				this.position.x + this.size,
				this.position.y
			);
			grd.addColorStop(0.1, this.theme[0]);
			grd.addColorStop(1, this.theme[1]);
			return grd;
		} else {
			return this.theme;
		}
	}

	public draw(): void {
		this.position = {
			x: this.position.x + this.velocity.vx,
			y: this.position.y + this.velocity.vy,
		};

		this.velocity.vy += this.gravity;
		this.life++;
		this.color = Array.isArray(this.theme)
			? this.setColorAndFillStyles()
			: this.theme;

		if (this.shape === 'circle') {
			this.drawCircle();
		} else if (this.shape === 'square') {
			this.drawSquare();
		} else if (this.shape === 'leaf') {
			this.drawLeaf();
		} else if (this.shape === 'star') {
			this.drawStar();
		}
	}

	private drawLeaf(): void {
		this.context.drawImage(
			this.leafImage,
			this.position.x,
			this.position.y
		);
	}

	private drawCircle(): void {
		this.context.beginPath();
		this.context.fillStyle = this.color;

		this.context.arc(
			this.position.x,
			this.position.y,
			this.size,
			0,
			Math.PI * 2,
			true
		);
		this.context.closePath();
		this.context.fill();
	}

	private drawSquare(): void {
		this.context.fillStyle = this.color;
		this.context.fillRect(
			this.position.x,
			this.position.y,
			this.size,
			this.size
		);
		this.context.fill();
	}

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
