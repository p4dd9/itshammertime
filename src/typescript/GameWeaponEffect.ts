import GameCursor from './GameCursor';
import IGameImage from '../interfaces/IGameImage';
import AssetLoader from './AssetLoader';
import { weaponAssets, weaponAlias } from '../assets/weaponAssets';
import IPosition from '../interfaces/IPosition';

export default class GameWeaponEffect {
	private _context: CanvasRenderingContext2D;
	private _image: IGameImage | undefined = undefined;
	private _images: Map<string, IGameImage> | null = null;

	private _effectPosition: IPosition;
	private _initSelfDestructId: () => void;

	constructor(context: CanvasRenderingContext2D, gameCursor: GameCursor) {
		this._context = context;
		// tslint:disable-next-line: no-empty
		this._initSelfDestructId = () => {};
		this._effectPosition = {
			x: gameCursor.mousePosition.x,
			y: gameCursor.mousePosition.y,
		};

		this.loadAssets();

		console.log(this._images);
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
		const images = await AssetLoader.loadImages(weaponAssets);

		this._image = images.get(weaponAlias.HAMMER_EFFECT);
		this._images = images;
	}

	public draw() {
		if (this._image === undefined) {
			return;
		}

		this.drawGameWeaponEffect();
	}

	private drawGameWeaponEffect() {
		const { _image, _effectPosition } = this;

		this._context.drawImage(
			_image!.img,
			0,
			0,
			_image!.img.width,
			_image!.img.height,
			_effectPosition.x,
			_effectPosition.y,
			_image!.img.width / _image!.scaleOnCanvas,
			_image!.img.height / _image!.scaleOnCanvas
		);
	}
}
