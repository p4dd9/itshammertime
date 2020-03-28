import WeaponVFX from '../WeaponVFX';
import IPosition from '../../interfaces/IPosition';
import { hammerImageAssets, hammerImageAlias } from '../../assets/imageAssets';
import { hammerAudioAssets, hammerAudioAlias } from '../../assets/audioAssets';

export default class HammerVFX extends WeaponVFX {
	public static lifeTime = 5000; // ms

	public imageAssets = hammerImageAssets;
	public audioAssets = hammerAudioAssets;

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
