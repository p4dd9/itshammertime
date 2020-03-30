import WeaponEffect from '../WeaponEffect';
import IPosition from '../../interfaces/IPosition';
import { hammerImageAssets, hammerImageAlias } from '../../assets/imageAssets';
import { hammerAudioAssets, hammerAudioAlias } from '../../assets/audioAssets';
import HammerParticle from './HammerParticle';

export default class HammerVFX extends WeaponEffect {
	public static lifeTime = 5000; // ms

	public imageAssets = hammerImageAssets;
	public audioAssets = hammerAudioAssets;

	private particles: { [key: string]: HammerParticle } = {};
	private particleIndex = 0;
	private particlesLoaded = false;

	private particleSettings = {
		maxLife: 20,
		density: 15,
		particleSize: 5,
		gravity: 0.5,
	};

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
		const { currentImage: image, effectPosition } = this;

		if (image === undefined || image === null) {
			return;
		}

		if (!this.particlesLoaded) {
			this.generateParticles();
		}

		const scaledWidth = image.image.width / image.scaleOnCanvas;
		const scaledHeight = image.image.height / image.scaleOnCanvas;

		const canvasX = effectPosition.x - scaledWidth / 2;
		const canvasY = effectPosition.y - scaledHeight / 2;

		this.context.drawImage(
			image.image,
			0,
			0,
			image.image.width,
			image.image.height,
			canvasX,
			canvasY,
			scaledWidth,
			scaledHeight
		);

		this.drawParticles();
	}

	private generateParticles(): void {
		const { currentImage: image, effectPosition, particleSettings } = this;

		if (image === undefined || image === null) {
			return;
		}
		const scaledWidth = image.image.width / image.scaleOnCanvas;
		const scaledHeight = image.image.height / image.scaleOnCanvas;

		const canvasX = effectPosition.x - scaledWidth / 2;
		const canvasY = effectPosition.y - scaledHeight / 2;

		for (let i = 0; i < particleSettings.density; i++) {
			const particle = new HammerParticle(
				this.context,
				{
					x: canvasX + scaledWidth / 2,
					y: canvasY + scaledHeight / 2,
				},
				this.particleIndex,
				particleSettings.particleSize,
				particleSettings.gravity
			);
			this.particleIndex++;
			this.particles[this.particleIndex.toString()] = particle;
		}
		this.particlesLoaded = true;
	}

	private drawParticles(): void {
		for (const particleKey in this.particles) {
			const particle = this.particles[particleKey];
			particle.draw();
			if (particle.life >= this.particleSettings.maxLife) {
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
