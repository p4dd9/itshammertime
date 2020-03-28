import Weapon from '../Weapon';
import CanvasCursor from '../CanvasCursor';
import { hammerImageAssets } from '../../assets/imageAssets';
import { hammerAudioAssets, hammerAudioAlias } from '../../assets/audioAssets';
import { hammerImageAlias } from '../../assets/imageAssets';
import HammerVFX from '../weaponeffects/HammerVFX';

export default class HammerWeapon extends Weapon {
	public imageAssets = hammerImageAssets;
	public audioAssets = hammerAudioAssets;

	private rotateSpeed = 12.5;
	private rotateDegreeThreshold = 25;
	private angle = 0;
	private moveForward = true;
	private animateHammer = false;

	constructor(context: CanvasRenderingContext2D, canvasCursor: CanvasCursor) {
		super(
			context,
			canvasCursor,
			hammerImageAssets,
			hammerAudioAssets,
			hammerImageAlias.HAMMER,
			hammerAudioAlias.HAMMER
		);

		this.removeActiveEffect = this.removeActiveEffect.bind(this);

		this.use = this.use.bind(this);
		this.addEventListeners = this.addEventListeners.bind(this);
		this.removeEventListeners = this.removeEventListeners.bind(this);
	}

	// delete gameweaponeffect? effect = undefined;
	protected removeActiveEffect(): void {
		this.gameWeaponEffect.shift();
		this.removeEventListeners();
	}

	public draw(): void {
		if (this.image === undefined) {
			return;
		}
		if (this.gameWeaponEffect.length > 0) {
			for (const gameEffect of this.gameWeaponEffect) {
				gameEffect.draw();
			}
		}
		const { image, context } = this;

		const sourceImage = image!.img;
		const sourceImageWidth = image!.img.width;
		const sourceImageHeight = image!.img.height;

		const scaledWidth = image!.img.width / image!.scaleOnCanvas;
		const scaledHeight = image!.img.height / image!.scaleOnCanvas;

		this.context.save();
		this.setRotationPivotToMouse('set');

		context.rotate(this.degToRad(-this.angle));

		this.context.drawImage(
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

		this.setRotationPivotToMouse('reset');
		context.restore();

		this.updateHammerRotation();
	}

	private setRotationPivotToMouse(rotationDirection: 'set' | 'reset'): void {
		const directionNumber = rotationDirection === 'set' ? 1 : -1;

		this.context.translate(
			directionNumber * this.canvasCursor.mousePosition.x,
			directionNumber * this.canvasCursor.mousePosition.y
		);
	}

	private updateHammerRotation(): void {
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

	protected use(): void {
		const image = this.image;

		this.animateHammer = true;

		const scaledWidth = image!.img.width / image!.scaleOnCanvas;
		const scaledHeight = image!.img.height / image!.scaleOnCanvas;

		const newGameWeaponEffect = new HammerVFX(this.context, {
			x: this.canvasCursor.mousePosition.x - scaledWidth / 2 - 80, // hammer effect related
			y: this.canvasCursor.mousePosition.y - scaledHeight / 2,
		});
		newGameWeaponEffect.initSelfDestructId = this.removeActiveEffect;

		this.gameWeaponEffect.push(newGameWeaponEffect);
	}

	protected addEventListeners(): void {
		this.context.canvas.addEventListener('click', this.use);
	}

	public removeEventListeners(): void {
		this.context.canvas.removeEventListener('click', this.use);
	}
}
