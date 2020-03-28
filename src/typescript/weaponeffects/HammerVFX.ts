import WeaponVFX from '../WeaponVFX';
import IPosition from '../../interfaces/IPosition';
import { hammerImageAssets, hammerImageAlias } from '../../assets/imageAssets';
import { hammerAudioAssets, hammerAudioAlias } from '../../assets/audioAssets';

export default class HammerVFX extends WeaponVFX {
	private _initSelfDestructId: () => void;

	public imageAssets = hammerImageAssets;
	public audioAssets = hammerAudioAssets;

	constructor(context: CanvasRenderingContext2D, position: IPosition) {
		super(
			context,
			position,
			hammerImageAssets,
			hammerAudioAssets,
			hammerImageAlias.HAMMER_EFFECT,
			hammerAudioAlias.HAMMER
		);

		this._initSelfDestructId = (): void => {
			return;
		};
	}

	public draw(): void {
		if (this.image === undefined) {
			return;
		}

		const { image, effectPosition } = this;
		const scaledWidth = image!.img.width / image!.scaleOnCanvas;
		const scaledHeight = image!.img.height / image!.scaleOnCanvas;

		this.context.drawImage(
			image!.img,
			0,
			0,
			image!.img.width,
			image!.img.height,
			effectPosition.x - scaledWidth / 2,
			effectPosition.y - scaledHeight / 2,
			scaledWidth,
			scaledHeight
		);
	}

	public set initSelfDestructId(removeItSelf: () => void) {
		if (removeItSelf === null) {
			return;
		}
		window.setTimeout(() => {
			removeItSelf();
		}, 5000);
	}

	public get initSelfDestructId(): () => void {
		return this._initSelfDestructId;
	}
}
