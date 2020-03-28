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

		const { image: _image, _effectPosition } = this;
		const scaledWidth = _image!.img.width / _image!.scaleOnCanvas;
		const scaledHeight = _image!.img.height / _image!.scaleOnCanvas;

		this._context.drawImage(
			_image!.img,
			0,
			0,
			_image!.img.width,
			_image!.img.height,
			_effectPosition.x - scaledWidth / 2,
			_effectPosition.y - scaledHeight / 2,
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
