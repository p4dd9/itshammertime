import GameAudio from './GameAudio';
import LocalStorageUtil from '../util/LocalStorageUtil';
import LOCAL_STORAGE from '../config/LOCAL_STORAGE';
import DOM_ID from '../config/DOM_ID';
import Game from './Game';

import VolumeOffImage from '../assets/icons/volume-off-outline.svg';
import VolumeLowImage from '../assets/icons/volume-low-outline.svg';
import VolumeMediumImage from '../assets/icons/volume-medium-outline.svg';
import VolumeHighImage from '../assets/icons/volume-high-outline.svg';

export default class UI {
	private _game: Game;
	private _audioButton: HTMLButtonElement | null;
	private _audioButtonImage: HTMLImageElement | null;
	public _uiLayer: HTMLDivElement | null;

	constructor(game: Game) {
		this._game = game;
		this._uiLayer = document.getElementById(
			DOM_ID.uiLayer
		) as HTMLDivElement;
		this._audioButton = document.getElementById(
			DOM_ID.audioButton
		) as HTMLButtonElement;
		this._audioButtonImage = document.getElementById(
			DOM_ID.audioButtonImage
		) as HTMLImageElement;

		this.initAudioButton();
	}

	private initAudioButton() {
		if (this._audioButton !== null) {
			this.setAudioButtonImage(LocalStorageUtil.initVolume());

			this._audioButton.addEventListener('click', () => {
				const newVolumeIndex: number =
					this._game.gameAudio.volumeIndex + 1;

				if (newVolumeIndex > GameAudio.volumeRange.length - 1) {
					this._game.gameAudio.volumeIndex = 0;
					LocalStorageUtil.setItem(LOCAL_STORAGE.volumeIndex, '0');
				} else {
					this._game.gameAudio.volumeIndex = newVolumeIndex;
					LocalStorageUtil.setItem(
						LOCAL_STORAGE.volumeIndex,
						String(newVolumeIndex)
					);
				}
			});
		}
	}

	public setAudioButtonImage(volumeIndex: number) {
		if (this._audioButtonImage === null) {
			return;
		}
		switch (volumeIndex) {
			case 0: {
				this._audioButtonImage.src = VolumeOffImage;
				break;
			}
			case 1: {
				this._audioButtonImage.src = VolumeLowImage;
				break;
			}
			case 2: {
				this._audioButtonImage.src = VolumeMediumImage;
				break;
			}
			case 3: {
				this._audioButtonImage.src = VolumeHighImage;
				break;
			}
		}
	}
}
