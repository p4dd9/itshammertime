import LocalStorageUtil from '../util/LocalStorageUtil';
import Game from './Game';

export default class GameAudio {
	private _game: Game;
	private _volumeIndex = LocalStorageUtil.initVolumeIndex();
	public static volumeRange = [0, 0.25, 0.5, 0.75];

	constructor(game: Game) {
		this._game = game;
	}

	get volumeIndex(): number {
		return this._volumeIndex;
	}

	set volumeIndex(volumeIndex: number) {
		this._volumeIndex = volumeIndex;
		this._game.ui.setAudioButtonImage(volumeIndex);

		for (const audioAsset of this._game.ludecat.audio!.values()) {
			audioAsset.audio.volume = GameAudio.volumeRange[this._volumeIndex];
		}

		for (const audioAsset of this._game.gameCursorWeapon.audio!.values()) {
			audioAsset.audio.volume = GameAudio.volumeRange[this._volumeIndex];
		}
	}

	public static playSound(audio: HTMLAudioElement): void {
		if (!audio.paused) {
			return;
		} else {
			audio.play();
		}
	}

	public static playSoundOverlap(audio: HTMLAudioElement): void {
		audio.currentTime = 0;
		audio.play();
	}
}
