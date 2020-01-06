import AssetLoader from './AssetLoader';

export default class AudioManager {
	private static async playSound(elementId: string) {
		const htmlElement: HTMLElement | null = document.getElementById(
			elementId
		);

		if (!(htmlElement as HTMLAudioElement).paused || htmlElement === null) {
			return;
		} else {
			const audioHTMLElement = htmlElement as HTMLAudioElement;
			audioHTMLElement.play();
		}
	}

	public static meow() {
		AudioManager.playSound(AssetLoader.audio.meow.id);
	}

	public static nya() {
		AudioManager.playSound(AssetLoader.audio.nya.id);
	}

	public static meow2() {
		AudioManager.playSound(AssetLoader.audio.meow2.id);
	}
}
