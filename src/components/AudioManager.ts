import meowSound from '../assets/audio/meow.mp3';

export default class AudioManager {
	private static volume = 0.5;

	private static async playSound(elementId: string, track: string) {
		const htmlElement: HTMLElement | null = document.getElementById(
			elementId
		);

		if (!(htmlElement as HTMLAudioElement).paused || htmlElement === null) {
			return;
		} else {
			const audioHTMLElement = htmlElement as HTMLAudioElement;
			if (audioHTMLElement.src.length === 0) {
				audioHTMLElement.src = track;
				audioHTMLElement.volume = AudioManager.volume;
			}
			audioHTMLElement.play();
		}
	}

	public static meow() {
		AudioManager.playSound('meow-sound', meowSound);
	}
}
