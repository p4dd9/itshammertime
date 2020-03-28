import IGameImage from '../interfaces/IGameImage';
import AssetLoader from './AssetLoader';
import { imageAssets, imageAlias } from '../assets/imageAssets';
import IPosition from '../interfaces/IPosition';

export default class GameWeaponEffect {
	private _context: CanvasRenderingContext2D;
	private _image: IGameImage | undefined = undefined;
	private _images: Map<string, IGameImage> | null = null;

	private _effectPosition: IPosition;
	private _initSelfDestructId: () => void;

	constructor(context: CanvasRenderingContext2D, position: IPosition) {
		this._context = context;
		// tslint:disable-next-line: no-empty
		this._initSelfDestructId = () => {};
		this._effectPosition = {
			x: position.x,
			y: position.y,
		};

		this.loadAssets();
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

	private async loadAssets() {
		const images = await AssetLoader.loadImages(imageAssets);

		this._images = images;
		this._image = this._images.get(imageAlias.HAMMER_EFFECT);
	}

	public draw() {
		if (this._image === undefined) {
			return;
		}

		this.drawGameWeaponEffect();
	}

	private drawGameWeaponEffect() {
		const { _image, _effectPosition } = this;
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
}
