import LocalStorageUtil from '../util/LocalStorageUtil';
import Game from './Game';

export default class GameAudio {
	private _game: Game;
	private _volumeIndex = LocalStorageUtil.initVolume();
	public static volumeRange = [0, 0.25, 0.75, 1];

	constructor(game: Game) {
		this._game = game;
	}

	get volumeIndex(): number {
		return this._volumeIndex;
	}

	set volumeIndex(volumeIndex: number) {
		this._volumeIndex = volumeIndex;
		this._game.ui.setAudioButtonImage(volumeIndex);

		// TODO: Make Audio Assets global by adding it to the Game class
		for (const audio of this._game.ludecat.audio!) {
			audio.volume = GameAudio.volumeRange[this._volumeIndex];
		}
	}

	public static playSound(audio: HTMLAudioElement) {
		if (!audio.paused) {
			return;
		} else {
			audio.play();
		}
	}
}
