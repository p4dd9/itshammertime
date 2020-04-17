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
			hammerAudioAlias.HAMMER_SHATTER_01
		);

		this.removeActiveEffect = this.removeActiveEffect.bind(this);
		this.use = this.use.bind(this);
	}

	protected removeActiveEffect(): void {
		this.effects.shift();
	}

	public draw(): void {
		if (this.currentImage === undefined) {
			return;
		}

		if (this.effects.length > 0) {
			for (const gameEffect of this.effects) {
				gameEffect.draw();
			}
		}

		this.contexts[LAYERS.FRONT].save();
		this.translateRotationPivotToMouse('set');
		this.contexts[LAYERS.FRONT].rotate(degToRad(-this.angle));
		this.drawWeaponImage();
		this.translateRotationPivotToMouse('reset');
		this.contexts[LAYERS.FRONT].restore();

		this.updateHammerAnimation();
	}

	private drawWeaponImage(): void {
		if (this.currentImage === undefined) {
			return;
		}

		const sourceImage = this.currentImage.image;
		const sourceImageWidth = this.currentImage.image.width;
		const sourceImageHeight = this.currentImage.image.height;

		const scaledWidth =
			this.currentImage.image.width / this.currentImage.scaleOnCanvas;
		const scaledHeight =
			this.currentImage.image.height / this.currentImage.scaleOnCanvas;

		this.contexts[LAYERS.FRONT].drawImage(
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
				x: this.position.x - scaledWidth / 2 - 80, // -80 hammer effect related
				y: this.position.y - scaledHeight / 2,
			},
			this.effectSettings
		);
		newGameWeaponEffect.selfDestruct = this.removeActiveEffect;

		this.effects.push(newGameWeaponEffect);
	}
}
