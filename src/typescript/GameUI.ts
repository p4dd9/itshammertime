import GameAudio from './GameAudio';
import LocalStorageUtil from '../util/LocalStorageUtil';
import DOM_ID from '../config/DOM_ID';
import Game from './Game';

import VolumeOffImage from '../assets/icons/volume-off-outline.svg';
import VolumeLowImage from '../assets/icons/volume-low-outline.svg';
import VolumeMediumImage from '../assets/icons/volume-medium-outline.svg';
import VolumeHighImage from '../assets/icons/volume-high-outline.svg';

export default class UI {
	public uiLayer: HTMLDivElement | null;

	private game: Game;
	private audioButton: HTMLButtonElement | null;
	private audioButtonImage: HTMLImageElement | null;

	constructor(game: Game) {
		this.game = game;
		this.uiLayer = document.getElementById(
			DOM_ID.uiLayer
		) as HTMLDivElement;
		this.audioButton = document.getElementById(
			DOM_ID.uiAudioButton
		) as HTMLButtonElement;
		this.audioButtonImage = document.getElementById(
			DOM_ID.uiAudioButtonImage
		) as HTMLImageElement;

		this.initAudioButton();
	}

	private initAudioButton(): void {
		if (this.audioButton !== null) {
			this.setAudioButtonImage(LocalStorageUtil.initVolumeIndex());

			this.audioButton.addEventListener('click', () => {
				const newVolumeIndex: number =
					(this.game.gameAudio.volumeIndex + 1) %
					GameAudio.volumeRange.length;

				this.game.gameAudio.volumeIndex = newVolumeIndex;
				LocalStorageUtil.setVolumeIndex(newVolumeIndex);
			});
		}
	}

	public setAudioButtonImage(volumeIndex: number): void {
		const audioButtonImage = this.audioButtonImage;

		if (audioButtonImage === null) {
			return;
		}
		switch (volumeIndex) {
			case 0: {
				audioButtonImage.src = VolumeOffImage;
				break;
			}
			case 1: {
				audioButtonImage.src = VolumeLowImage;
				break;
			}
			case 2: {
				audioButtonImage.src = VolumeMediumImage;
				break;
			}
			case 3: {
				audioButtonImage.src = VolumeHighImage;
				break;
			}
		}
	}
}
