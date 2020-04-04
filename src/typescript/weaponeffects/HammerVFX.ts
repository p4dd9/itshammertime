import WeaponEffect from '../WeaponEffect';
import IPosition from '../../interfaces/IPosition';
import { hammerImageAssets } from '../../assets/imageAssets';
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
			hammerAudioAlias.HAMMER
		);
	}

	public draw(): void {
		const { currentImage, effectPosition } = this;

		if (currentImage === undefined || currentImage === null) {
			return;
		}

		if (!this.particlesLoaded) {
			this.generateParticles();
		}

		const scaledWidth =
			currentImage.image.width / currentImage.scaleOnCanvas;
		const scaledHeight =
			currentImage.image.height / currentImage.scaleOnCanvas;

		const canvasX = effectPosition.x - scaledWidth / 2;
		const canvasY = effectPosition.y - scaledHeight / 2;

		this.context.drawImage(
			currentImage.image,
			0,
			0,
			currentImage.image.width,
			currentImage.image.height,
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
			const color = this.getRandomDistinctColorCode(
				this.particleSettings.density,
				i
			);
			const particle = new HammerParticle(
				this.context,
				{
					x: canvasX + scaledWidth / 2,
					y: canvasY + scaledHeight / 2,
				},
				this.particleIndex,
				particleSettings.particleSize,
				particleSettings.gravity,
				color
			);
			this.particleIndex++;
			this.particles[this.particleIndex.toString()] = particle;
		}
		this.particlesLoaded = true;
	}

	// https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
	// https://stackoverflow.com/questions/1484506/random-color-generator
	private getRandomDistinctColorCode(
		numOfSteps: number,
		step: number
	): string {
		// This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
		// Adam Cole, 2011-Sept-14
		// HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
		let r, g, b;
		const h = step / numOfSteps;
		const i = ~~(h * 6); // round up
		const f = h * 6 - i;
		const q = 1 - f;
		switch (i % 6) {
			case 0:
				r = 1;
				g = f;
				b = 0;
				break;
			case 1:
				r = q;
				g = 1;
				b = 0;
				break;
			case 2:
				r = 0;
				g = 1;
				b = f;
				break;
			case 3:
				r = 0;
				g = q;
				b = 1;
				break;
			case 4:
				r = f;
				g = 0;
				b = 1;
				break;
			case 5:
				r = 1;
				g = 0;
				b = q;
				break;
		}
		const c =
			'#' +
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			('00' + (~~((r as any) * 255)).toString(16)).slice(-2) +
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			('00' + (~~((g as any) * 255)).toString(16)).slice(-2) +
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			('00' + (~~((b as any) * 255)).toString(16)).slice(-2);
		return c;
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
