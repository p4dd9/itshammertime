import GameAudio from './GameAudio';
import LocalStorageUtil from '../util/LocalStorageUtil';
import DOM_ID from '../config/DOM_ID';
import Game from './Game';

import VolumeOffImage from '../assets/icons/volume-off-outline.svg';
import VolumeLowImage from '../assets/icons/volume-low-outline.svg';
import VolumeMediumImage from '../assets/icons/volume-medium-outline.svg';
import VolumeHighImage from '../assets/icons/volume-high-outline.svg';

import hammerImage from '../assets/images/hammer.png';
import macheteImage from '../assets/images/machete.png';
import HammerWeapon from './weapons/HammerWeapon';
import MacheteWeapon from './weapons/MacheteWeapon';

export default class UI {
	public _uiLayer: HTMLDivElement | null;

	private _game: Game;
	private _audioButton: HTMLButtonElement | null;
	private _audioButtonImage: HTMLImageElement | null;

	private _hammerButton: HTMLButtonElement | null;
	private _hammerButtonImage: HTMLImageElement | null;

	private _macheteButton: HTMLButtonElement | null;
	private _macheteButtonImage: HTMLImageElement | null;

	constructor(game: Game) {
		this._game = game;
		this._uiLayer = document.getElementById(
			DOM_ID.uiLayer
		) as HTMLDivElement;
		this._audioButton = document.getElementById(
			DOM_ID.uiAudioButton
		) as HTMLButtonElement;
		this._audioButtonImage = document.getElementById(
			DOM_ID.uiAudioButtonImage
		) as HTMLImageElement;

		this._hammerButton = document.getElementById(
			DOM_ID.uiHammerButton
		) as HTMLButtonElement;
		this._hammerButtonImage = document.getElementById(
			DOM_ID.uiHammerButtonImage
		) as HTMLImageElement;

		this._macheteButton = document.getElementById(
			DOM_ID.uiMacheteButton
		) as HTMLButtonElement;
		this._macheteButtonImage = document.getElementById(
			DOM_ID.uiMacheteButtonImage
		) as HTMLImageElement;

		this.initAudioButton();
		this.initWeaponButtons();
	}

	private initWeaponButtons(): void {
		this._hammerButtonImage!.src = hammerImage;
		this._hammerButton?.addEventListener('click', () => {
			console.info('Switching to Hammer.');

			this._game.weapon = new HammerWeapon(
				this._game.context,
				this._game.canvasCursor
			);
		});

		this._macheteButtonImage!.src = macheteImage;
		this._macheteButton?.addEventListener('click', () => {
			console.info('Switching to Machete.');

			this._game.weapon = new MacheteWeapon(
				this._game.context,
				this._game.canvasCursor
			);
		});
	}

	private initAudioButton(): void {
		if (this._audioButton !== null) {
			this.setAudioButtonImage(LocalStorageUtil.initVolumeIndex());

			this._audioButton.addEventListener('click', () => {
				const newVolumeIndex: number =
					(this._game.gameAudio.volumeIndex + 1) %
					GameAudio.volumeRange.length;

				this._game.gameAudio.volumeIndex = newVolumeIndex;
				LocalStorageUtil.setVolumeIndex(newVolumeIndex);
			});
		}
	}

	public setAudioButtonImage(volumeIndex: number): void {
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
