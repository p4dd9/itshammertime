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
	public uiLayer: HTMLDivElement | null;

	private game: Game;
	private audioButton: HTMLButtonElement | null;
	private audioButtonImage: HTMLImageElement | null;

	private hammerButton: HTMLButtonElement | null;
	private hammerButtonImage: HTMLImageElement | null;

	private macheteButton: HTMLButtonElement | null;
	private macheteButtonImage: HTMLImageElement | null;

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

		this.hammerButton = document.getElementById(
			DOM_ID.uiHammerButton
		) as HTMLButtonElement;
		this.hammerButtonImage = document.getElementById(
			DOM_ID.uiHammerButtonImage
		) as HTMLImageElement;

		this.macheteButton = document.getElementById(
			DOM_ID.uiMacheteButton
		) as HTMLButtonElement;
		this.macheteButtonImage = document.getElementById(
			DOM_ID.uiMacheteButtonImage
		) as HTMLImageElement;

		this.initAudioButton();
		this.initWeaponButtons();
	}

	private initWeaponButtons(): void {
		this.hammerButtonImage!.src = hammerImage;
		this.hammerButton?.addEventListener('click', () => {
			console.info('Switching to Hammer.');

			this.game.weapon = new HammerWeapon(
				this.game.context,
				this.game.canvasCursor
			);
		});

		this.macheteButtonImage!.src = macheteImage;
		this.macheteButton?.addEventListener('click', () => {
			console.info('Switching to Machete.');

			this.game.weapon = new MacheteWeapon(
				this.game.context,
				this.game.canvasCursor
			);
		});
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
		if (this.audioButtonImage === null) {
			return;
		}
		switch (volumeIndex) {
			case 0: {
				this.audioButtonImage.src = VolumeOffImage;
				break;
			}
			case 1: {
				this.audioButtonImage.src = VolumeLowImage;
				break;
			}
			case 2: {
				this.audioButtonImage.src = VolumeMediumImage;
				break;
			}
			case 3: {
				this.audioButtonImage.src = VolumeHighImage;
				break;
			}
		}
	}
}
