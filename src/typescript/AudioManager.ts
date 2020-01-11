export default class AudioManager {
	public static playSound(audio: HTMLAudioElement) {
		if (!audio.paused) {
			return;
		} else {
			audio.play();
		}
	}
}
