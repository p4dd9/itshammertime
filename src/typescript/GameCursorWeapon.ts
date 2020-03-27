import IGameImage from '../interfaces/IGameImage';
import AssetLoader from './AssetLoader';
import { weaponAssets, weaponAlias } from '../assets/weaponAssets';
import IAudio from '../interfaces/IAudio';
import {
	weaponCursorAudioAssets,
	weaponaudioAlias,
} from '../assets/audioAssets';
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

	constructor(context: CanvasRenderingContext2D, gameCursor: GameCursor) {
		this._gameCursor = gameCursor;
		this._context = context;

		this.loadAssets();
		this.addEventListeners();

		this.removeActiveEffect = this.removeActiveEffect.bind(this);
	}

	private async loadAssets() {
		const cursorImages = await AssetLoader.loadImages(weaponAssets);
		const audio = await AssetLoader.loadAudio(weaponCursorAudioAssets);

		this._currentAudio = audio.get(weaponaudioAlias.HAMMER);

		this._cursorImages = cursorImages;
		this._cursorImage = this._cursorImages.get(weaponAlias.HAMMER);

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

	private drawGameCursorWeapon() {
		const { _cursorImage, _gameCursor } = this;
		const canvasX =
			_gameCursor.mousePosition.x -
			_cursorImage!.img.width / _cursorImage!.scaleOnCanvas / 2;
		const canvasY =
			_gameCursor.mousePosition.y -
			_cursorImage!.img.height / _cursorImage!.scaleOnCanvas / 2;

		const scaledWidth =
			_cursorImage!.img.width / _cursorImage!.scaleOnCanvas;
		const scaledHeight =
			_cursorImage!.img.height / _cursorImage!.scaleOnCanvas;

		this._context.drawImage(
			_cursorImage!.img,
			0,
			0,
			_cursorImage!.img.width,
			_cursorImage!.img.height,
			canvasX,
			canvasY,
			scaledWidth,
			scaledHeight
		);
	}

	private removeActiveEffect() {
		this._gameWeaponEffect.shift();
	}

	private addEventListeners() {
		document.addEventListener('click', (event: MouseEvent) => {
			GameAudio.playSoundOverlap(this._currentAudio!.audio);

			const newGameWeaponEffect = new GameWeaponEffect(
				this._context,
				this._gameCursor
			);
			newGameWeaponEffect.initSelfDestructId = this.removeActiveEffect;

			this._gameWeaponEffect.push(newGameWeaponEffect);
		});
	}
}
