import LocalStorageUtil from '../util/LocalStorageUtil';
import Game from './Game';

export default class GameAudio {
	public static volumeRange = [0, 0.15, 0.35, 0.65];

	private game: Game;
	private _volumeIndex = LocalStorageUtil.initVolumeIndex();

	constructor(game: Game) {
		this.game = game;
	}

	get volumeIndex(): number {
		return this._volumeIndex;
	}

	set volumeIndex(volumeIndex: number) {
		this._volumeIndex = volumeIndex;
		this.game.ui.setAudioButtonImage(volumeIndex);

		for (const audioAsset of this.game.ludecat.audio!.values()) {
			audioAsset.audio.volume = GameAudio.volumeRange[this._volumeIndex];
		}

		if (this.game.weapon === null) return;
		for (const audioAsset of this.game.weapon.audio!.values()) {
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
