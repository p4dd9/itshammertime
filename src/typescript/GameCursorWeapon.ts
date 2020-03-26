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

export default class GameCursoWeapon {
	private _cursorImage: IGameImage | undefined = undefined;
	private _cursorImages: Map<string, IGameImage> | null = null;

	private _currentAudio: IAudio | undefined = undefined;
	public audio: Map<string, IAudio> | null = null;

	private _gameCursor: GameCursor;
	private _context: CanvasRenderingContext2D;

	constructor(context: CanvasRenderingContext2D, gameCursor: GameCursor) {
		this._gameCursor = gameCursor;
		this._context = context;

		this.loadAssets();
		this.addEventListeners();
		console.log('GameCursor assets loaded ' + this._cursorImages);
	}

	public draw() {
		if (this._cursorImage === undefined) {
			return;
		}

		this.drawGameCursorWeapon();
	}

	private drawGameCursorWeapon() {
		const { _cursorImage, _gameCursor } = this;

		this._context.drawImage(
			_cursorImage!.img,
			0,
			0,
			_cursorImage!.img.width,
			_cursorImage!.img.height,
			_gameCursor.mousePosition.x,
			_gameCursor.mousePosition.y,
			_cursorImage!.img.width / _cursorImage!.scaleOnCanvas,
			_cursorImage!.img.height / _cursorImage!.scaleOnCanvas
		);
	}

	private async loadAssets() {
		const cursorImages = await AssetLoader.loadImages(weaponAssets);
		const audio = await AssetLoader.loadAudio(weaponCursorAudioAssets);

		this._cursorImage = cursorImages.get(weaponAlias.HAMMER);
		this._currentAudio = audio.get(weaponaudioAlias.HAMMER);

		this._cursorImages = cursorImages;
		this.audio = audio;
	}

	private addEventListeners() {
		document.addEventListener('click', (event: MouseEvent) => {
			GameAudio.playSoundOverlap(this._currentAudio!.audio);
		});
	}
}
