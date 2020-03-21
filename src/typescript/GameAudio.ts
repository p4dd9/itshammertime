import LocalStorageUtil from '../util/LocalStorageUtil';

export default class GameAudio {
	public static volumeIndex = LocalStorageUtil.initVolume();
	public static volumeRange = [0, 0.4, 1];

	public static playSound(audio: HTMLAudioElement) {
		audio.volume = this.volumeRange[this.volumeIndex];

		if (!audio.paused) {
			return;
		} else {
			audio.play();
		}
	}
}
