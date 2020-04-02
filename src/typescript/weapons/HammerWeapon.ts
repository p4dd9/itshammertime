import Weapon from '../Weapon';
import { hammerImageAssets } from '../../assets/imageAssets';
import { hammerAudioAssets, hammerAudioAlias } from '../../assets/audioAssets';
import { hammerImageAlias } from '../../assets/imageAssets';
import HammerVFX from '../weaponeffects/HammerVFX';
import { degToRad } from '../../util/commonUtil';
import IPosition from '../../interfaces/IPosition';

export default class HammerWeapon extends Weapon {
	public imageAssets = hammerImageAssets;
	public audioAssets = hammerAudioAssets;

	private rotateSpeed = 12;
	private rotateDegreeThreshold = 25;
	private angle = 0;
	private moveForward = true;
	private animateHammer = false;

	constructor(context: CanvasRenderingContext2D, position: IPosition) {
		super(
			context,
			position,
			hammerImageAssets,
			hammerAudioAssets,
			hammerImageAlias.HAMMER,
			hammerAudioAlias.HAMMER
		);

		this.removeActiveEffect = this.removeActiveEffect.bind(this);

		this.use = this.use.bind(this);
		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);
	}

	protected removeActiveEffect(): void {
		this.effect.shift();
	}

	public draw(): void {
		const {
			currentImage: image,
			context,
			effect: gameWeaponEffect,
			angle,
		} = this;

		if (image === undefined) {
			return;
		}

		if (gameWeaponEffect.length > 0) {
			for (const gameEffect of gameWeaponEffect) {
				gameEffect.draw();
			}
		}

		context.save();
		this.translateRotationPivotToMouse('set');
		context.rotate(degToRad(-angle));
		this.drawHammerWeapon();
		this.translateRotationPivotToMouse('reset');
		context.restore();

		this.updateHammerAnimation();
	}

	private drawHammerWeapon(): void {
		const { currentImage: image, context } = this;

		if (image === undefined) {
			return;
		}

		const sourceImage = image.image;
		const sourceImageWidth = image.image.width;
		const sourceImageHeight = image.image.height;

		const scaledWidth = image.image.width / image.scaleOnCanvas;
		const scaledHeight = image.image.height / image.scaleOnCanvas;

		context.drawImage(
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

		this.context.translate(
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

		const newGameWeaponEffect = new HammerVFX(this.context, {
			x: this.position.x - scaledWidth / 2 - 80, // hammer effect related
			y: this.position.y - scaledHeight / 2,
		});
		newGameWeaponEffect.selfDestruct = this.removeActiveEffect;

		this.effect.push(newGameWeaponEffect);
	}

	public start(): void {
		this.context.canvas.addEventListener('click', this.use);
	}

	public stop(): void {
		this.context.canvas.removeEventListener('click', this.use);
	}
}
