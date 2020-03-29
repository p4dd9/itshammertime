import WeaponVFX from '../WeaponVFX';
import IPosition from '../../interfaces/IPosition';
import { hammerImageAssets, hammerImageAlias } from '../../assets/imageAssets';
import { hammerAudioAssets, hammerAudioAlias } from '../../assets/audioAssets';
import Particle from './Particle';

export default class HammerVFX extends WeaponVFX {
	public static lifeTime = 5000; // ms

	public imageAssets = hammerImageAssets;
	public audioAssets = hammerAudioAssets;

	public maxLife = 20;
	private particles: { [key: string]: Particle } = {};
	private particleIndex = 0;
	private density = 15;
	private particleSize = 5;
	private generated = false;

	private _initSelfDestructId: (() => void) | null = null;

	constructor(context: CanvasRenderingContext2D, position: IPosition) {
		super(
			context,
			position,
			hammerImageAssets,
			hammerAudioAssets,
			hammerImageAlias.HAMMER_EFFECT,
			hammerAudioAlias.HAMMER
		);
	}

	public draw(): void {
		const { image, effectPosition } = this;

		if (image === undefined || image === null) {
			return;
		}

		if (!this.generated) {
			this.generateParticles();
		}

		const scaledWidth = image.img.width / image.scaleOnCanvas;
		const scaledHeight = image.img.height / image.scaleOnCanvas;

		const canvasX = effectPosition.x - scaledWidth / 2;
		const canvasY = effectPosition.y - scaledHeight / 2;

		this.context.drawImage(
			image.img,
			0,
			0,
			image.img.width,
			image.img.height,
			canvasX,
			canvasY,
			scaledWidth,
			scaledHeight
		);

		this.drawParticles();
	}

	private generateParticles(): void {
		const { image, effectPosition } = this;

		if (image === undefined || image === null) {
			return;
		}
		const scaledWidth = image.img.width / image.scaleOnCanvas;
		const scaledHeight = image.img.height / image.scaleOnCanvas;

		const canvasX = effectPosition.x - scaledWidth / 2;
		const canvasY = effectPosition.y - scaledHeight / 2;

		for (let i = 0; i < this.density; i++) {
			const particle = new Particle(
				this.context,
				{
					x: canvasX + scaledWidth / 2,
					y: canvasY + scaledHeight / 2,
				},
				this.particleIndex,
				this.particleSize,
				this.maxLife
			);
			this.particleIndex++;
			this.particles[this.particleIndex.toString()] = particle;
		}
		this.generated = true;
	}

	private drawParticles(): void {
		for (const particleKey in this.particles) {
			const particle = this.particles[particleKey];
			particle.draw();
			if (particle.life >= particle.maxLife) {
				delete this.particles[particle.id];
			}
		}
	}

	public set selfDestruct(removeItSelf: (() => void) | null) {
		if (removeItSelf === null) {
			return;
		}
		window.setTimeout(() => {
			removeItSelf();
		}, HammerVFX.lifeTime);
	}

	public get selfDestruct(): (() => void) | null {
		return this._initSelfDestructId;
	}
}
