import Weapon from '../Weapon';
import { hammerImageAssets } from '../../assets/imageAssets';
import { hammerAudioAssets, hammerAudioAlias } from '../../assets/audioAssets';
import { hammerImageAlias } from '../../assets/imageAssets';
import HammerVFX from '../weaponeffects/HammerVFX';
import { degToRad } from '../../util/commonUtil';
import IPosition from '../../interfaces/IPosition';
import IEffectSettings from '../../interfaces/IEffectSettings';
import LAYERS from '../../config/layers';

export default class HammerWeapon extends Weapon {
	public imageAssets = hammerImageAssets;
	public audioAssets = hammerAudioAssets;

	private rotateSpeed = 12;
	private rotateDegreeThreshold = 25;
	private angle = 0;
	private moveForward = true;
	private animateHammer = false;

	constructor(
		contexts: CanvasRenderingContext2D[],
		position: IPosition,
		effectSettings: IEffectSettings
	) {
		super(
			contexts,
			position,
			effectSettings,
			hammerImageAssets,
			hammerAudioAssets,
			hammerImageAlias.HAMMER,
			hammerAudioAlias.HAMMER_SHATTER
		);

		this.removeActiveEffect = this.removeActiveEffect.bind(this);

		this.use = this.use.bind(this);
		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);
	}

	protected removeActiveEffect(): void {
		this.effects.shift();
	}

	public draw(): void {
		const { currentImage, contexts, effects, angle } = this;

		if (currentImage === undefined) {
			return;
		}

		if (effects.length > 0) {
			for (const gameEffect of effects) {
				gameEffect.draw();
			}
		}

		contexts[LAYERS.FRONT].save();
		this.translateRotationPivotToMouse('set');
		contexts[LAYERS.FRONT].rotate(degToRad(-angle));
		this.drawHammerWeapon();
		this.translateRotationPivotToMouse('reset');
		contexts[LAYERS.FRONT].restore();

		this.updateHammerAnimation();
	}

	private drawHammerWeapon(): void {
		const { currentImage, contexts } = this;

		if (currentImage === undefined) {
			return;
		}

		const sourceImage = currentImage.image;
		const sourceImageWidth = currentImage.image.width;
		const sourceImageHeight = currentImage.image.height;

		const scaledWidth =
			currentImage.image.width / currentImage.scaleOnCanvas;
		const scaledHeight =
			currentImage.image.height / currentImage.scaleOnCanvas;

		contexts[LAYERS.FRONT].drawImage(
			sourceImage,
			0,
			0,
			sourceImageWidth,
			sourceImageHeight,
			-scaledWidth / 2,
			-scaledHeight,
			scaledWidth,
			scaledHeight
		);
	}

	private translateRotationPivotToMouse(
		rotationDirection: 'set' | 'reset'
	): void {
		const directionNumber = rotationDirection === 'set' ? 1 : -1;

		this.contexts[LAYERS.FRONT].translate(
			directionNumber * this.position.x,
			directionNumber * this.position.y
		);
	}

	private updateHammerAnimation(): void {
		if (this.animateHammer) {
			if (this.angle <= this.rotateDegreeThreshold && this.moveForward) {
				this.angle += this.rotateSpeed;
			} else {
				this.moveForward = false;
				if (this.angle <= 0) {
					this.moveForward = true;
					this.animateHammer = false;
				}
				this.angle -= this.rotateSpeed;
			}
		}
	}

	public use(): void {
		const image = this.currentImage!;

		this.animateHammer = true;

		const scaledWidth = image.image.width / image.scaleOnCanvas;
		const scaledHeight = image.image.height / image.scaleOnCanvas;

		const newGameWeaponEffect = new HammerVFX(
			this.contexts,
			{
				x: this.position.x - scaledWidth / 2 - 80, // hammer effect related
				y: this.position.y - scaledHeight / 2,
			},
			this.effectSettings
		);
		newGameWeaponEffect.selfDestruct = this.removeActiveEffect;

		this.effects.push(newGameWeaponEffect);
	}

	public start(): void {
		this.contexts[LAYERS.FRONT].canvas.addEventListener('click', this.use);
	}

	public stop(): void {
		this.contexts[LAYERS.FRONT].canvas.removeEventListener(
			'click',
			this.use
		);
	}
}
