import GameAudio from './GameAudio';
import LocalStorageUtil from '../util/LocalStorageUtil';
import LOCAL_STORAGE from '../config/LOCAL_STORAGE';

export default class UI {
	public audioButton: HTMLButtonElement | null;
	public uiLayer: HTMLDivElement | null;

	constructor() {
		this.uiLayer = document.getElementById('ui-layer') as HTMLDivElement;
		this.audioButton = document.getElementById(
			'ui-audio-button'
		) as HTMLButtonElement;

		this.initAudioButton();
	}

	private initAudioButton() {
		if (this.audioButton !== null) {
			this.audioButton.addEventListener('click', () => {
				const newVolumeIndex: number = GameAudio.volumeIndex + 1;

				if (newVolumeIndex > GameAudio.volumeRange.length - 1) {
					GameAudio.volumeIndex = 0;
					LocalStorageUtil.setItem(LOCAL_STORAGE.volumeIndex, '0');
				} else {
					GameAudio.volumeIndex = newVolumeIndex;
					LocalStorageUtil.setItem(
						LOCAL_STORAGE.volumeIndex,
						String(newVolumeIndex)
					);
				}
			});
		}
	}
}
