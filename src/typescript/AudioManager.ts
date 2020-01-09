export default class AudioManager {
	public static playSound(elementId: string) {
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
}
