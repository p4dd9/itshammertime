import IGameImage from '../interfaces/IGameImage';
import AssetLoader from './AssetLoader';
import { imageAssets, imageAlias } from '../assets/imageAssets';
import IAudio from '../interfaces/IAudio';
import { audioAssets, audioAlias } from '../assets/audioAssets';
import GameCursor from './GameCursor';
import GameAudio from './GameAudio';
import GameWeaponEffect from './GameWeaponEffect';

export default class GameCursorWeapon {
	private _cursorImage: IGameImage | undefined = undefined;
	private _cursorImages: Map<string, IGameImage> | null = null;

	private _currentAudio: IAudio | undefined = undefined;
	public audio: Map<string, IAudio> | null = null;

	private _gameCursor: GameCursor;
	private _context: CanvasRenderingContext2D;

	private _gameWeaponEffect: GameWeaponEffect[] = new Array() as GameWeaponEffect[];
	private _rotateSpeed: number = 12.5;
	private _rotateDegreeThreshold: number = 25;

	public angle: number = 0;
	public moveForward: boolean = true;
	public animateHammer: boolean = false;

	constructor(context: CanvasRenderingContext2D, gameCursor: GameCursor) {
		this._gameCursor = gameCursor;
		this._context = context;

		this.loadAssets();
		this.addEventListeners();

		this.removeActiveEffect = this.removeActiveEffect.bind(this);
	}

	private async loadAssets() {
		const cursorImages = await AssetLoader.loadImages(imageAssets);
		const audio = await AssetLoader.loadAudio(audioAssets);

		this._currentAudio = audio.get(audioAlias.HAMMER);

		this._cursorImages = cursorImages;
		this._cursorImage = this._cursorImages.get(imageAlias.HAMMER);

		this.audio = audio;
	}

	public draw() {
		if (this._cursorImage === undefined) {
			return;
		}
		if (this._gameWeaponEffect.length > 0) {
			for (const gameEffect of this._gameWeaponEffect) {
				gameEffect.draw();
			}
		}
		this.drawGameCursorWeapon();
	}

	public degToRad(degree: number) {
		return degree * 0.01745;
	}

	private drawGameCursorWeapon() {
		const { _cursorImage, _context } = this;

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

	private setRotationPivotToMouse(rotationDirection: 'set' | 'reset') {
		const directionNumber = rotationDirection === 'set' ? 1 : -1;

		this._context.translate(
			directionNumber * this._gameCursor.mousePosition.x,
			directionNumber * this._gameCursor.mousePosition.y
		);
	}

	private updateHammerRotation() {
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
	private removeActiveEffect() {
		this._gameWeaponEffect.shift();
	}

	private addEventListeners() {
		document.addEventListener('click', (event: MouseEvent) => {
			GameAudio.playSoundOverlap(this._currentAudio!.audio);
			this.animateHammer = true;
			const { _cursorImage } = this;

			const scaledWidth =
				_cursorImage!.img.width / _cursorImage!.scaleOnCanvas;
			const scaledHeight =
				_cursorImage!.img.height / _cursorImage!.scaleOnCanvas;

			const newGameWeaponEffect = new GameWeaponEffect(this._context, {
				x: this._gameCursor.mousePosition.x - scaledWidth / 2 - 80, // hammer effect related
				y: this._gameCursor.mousePosition.y - scaledHeight / 2,
			});
			newGameWeaponEffect.initSelfDestructId = this.removeActiveEffect;

			this._gameWeaponEffect.push(newGameWeaponEffect);
		});
	}
}
