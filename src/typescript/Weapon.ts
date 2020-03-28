import IGameImage from '../interfaces/IGameImage';
import AssetLoader from './AssetLoader';
import { imageAssets, imageAlias } from '../assets/imageAssets';
import IAudio from '../interfaces/IAudio';
import { audioAssets, audioAlias } from '../assets/audioAssets';
import CanvasCursor from './CanvasCursor';
import GameAudio from './GameAudio';
import WeaponEffect from './WeaponEffect';

export default class Weapon {
	public image: IGameImage | undefined = undefined;
	public images: Map<string, IGameImage> | null = null;
	public audio: Map<string, IAudio> | null = null;
	public angle = 0;
	public moveForward = true;
	public animateHammer = false;

	private _currentAudio: IAudio | undefined = undefined;

	private _gameCursor: CanvasCursor;
	private _context: CanvasRenderingContext2D;

	private _gameWeaponEffect: WeaponEffect[] = [] as WeaponEffect[];
	private _rotateSpeed = 12.5;
	private _rotateDegreeThreshold = 25;

	constructor(context: CanvasRenderingContext2D, gameCursor: CanvasCursor) {
		this._gameCursor = gameCursor;
		this._context = context;

		this.loadAssets();
		this.addEventListeners();

		this.removeActiveEffect = this.removeActiveEffect.bind(this);
	}

	private async loadAssets(): Promise<void> {
		const cursorImages = await AssetLoader.loadImages(imageAssets);
		const audio = await AssetLoader.loadAudio(audioAssets);

		this._currentAudio = audio.get(audioAlias.HAMMER);

		this.images = cursorImages;
		this.image = this.images.get(imageAlias.HAMMER);

		this.audio = audio;
	}

	public draw(): void {
		if (this.image === undefined) {
			return;
		}
		if (this._gameWeaponEffect.length > 0) {
			for (const gameEffect of this._gameWeaponEffect) {
				gameEffect.draw();
			}
		}
		this.drawGameCursorWeapon();
	}

	public degToRad(degree: number): number {
		return degree * 0.01745;
	}

	private drawGameCursorWeapon(): void {
		const { image: _cursorImage, _context } = this;

		const sourceImage = _cursorImage!.img;
		const sourceImageWidth = _cursorImage!.img.width;
		const sourceImageHeight = _cursorImage!.img.height;

		const scaledWidth =
			_cursorImage!.img.width / _cursorImage!.scaleOnCanvas;
		const scaledHeight =
			_cursorImage!.img.height / _cursorImage!.scaleOnCanvas;

		this._context.save();
		this.setRotationPivotToMouse('set');

		_context.rotate(this.degToRad(-this.angle));

		this._context.drawImage(
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
		_context.restore();

		this.updateHammerRotation();
	}

	private setRotationPivotToMouse(rotationDirection: 'set' | 'reset'): void {
		const directionNumber = rotationDirection === 'set' ? 1 : -1;

		this._context.translate(
			directionNumber * this._gameCursor.mousePosition.x,
			directionNumber * this._gameCursor.mousePosition.y
		);
	}

	private updateHammerRotation(): void {
		if (this.animateHammer) {
			if (this.angle <= this._rotateDegreeThreshold && this.moveForward) {
				this.angle += this._rotateSpeed;
			} else {
				this.moveForward = false;
				if (this.angle <= 0) {
					this.moveForward = true;
					this.animateHammer = false;
				}
				this.angle -= this._rotateSpeed;
			}
		}
	}

	// delete gameweaponeffect? effect = undefined;
	private removeActiveEffect(): void {
		this._gameWeaponEffect.shift();
	}

	private addEventListeners(): void {
		document.addEventListener('click', () => {
			GameAudio.playSoundOverlap(this._currentAudio!.audio);
			this.animateHammer = true;
			const { image: _cursorImage } = this;

			const scaledWidth =
				_cursorImage!.img.width / _cursorImage!.scaleOnCanvas;
			const scaledHeight =
				_cursorImage!.img.height / _cursorImage!.scaleOnCanvas;

			const newGameWeaponEffect = new WeaponEffect(this._context, {
				x: this._gameCursor.mousePosition.x - scaledWidth / 2 - 80, // hammer effect related
				y: this._gameCursor.mousePosition.y - scaledHeight / 2,
			});
			newGameWeaponEffect.initSelfDestructId = this.removeActiveEffect;

			this._gameWeaponEffect.push(newGameWeaponEffect);
		});
	}
}
