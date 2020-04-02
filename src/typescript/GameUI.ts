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
import laserImage from '../assets/images/flashlight.png';

import HammerWeapon from './weapons/HammerWeapon';
import MacheteWeapon from './weapons/MacheteWeapon';
import LaserWeapon from './weapons/LaserWeapon';

export default class UI {
	public uiLayer: HTMLDivElement | null;

	private game: Game;
	private audioButton: HTMLButtonElement | null;
	private audioButtonImage: HTMLImageElement | null;

	private hammerButton: HTMLButtonElement | null;
	private hammerButtonImage: HTMLImageElement | null;

	private macheteButton: HTMLButtonElement | null;
	private macheteButtonImage: HTMLImageElement | null;

	private laserButton: HTMLButtonElement | null;
	private laserButtonImage: HTMLImageElement | null;

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

		this.laserButton = document.getElementById(
			DOM_ID.uiLaserButton
		) as HTMLButtonElement;
		this.laserButtonImage = document.getElementById(
			DOM_ID.uiLaserButtonImage
		) as HTMLImageElement;

		this.initAudioButton();
		this.initWeaponButtons();
	}

	private initWeaponButtons(): void {
		this.hammerButtonImage!.src = hammerImage;
		this.hammerButton?.addEventListener('click', () => {
			console.info('Switching to Hammer.');

			this.game.weapon = new HammerWeapon(this.game.context, {
				x: 200,
				y: 200,
			});
		});

		this.macheteButtonImage!.src = macheteImage;
		this.macheteButton?.addEventListener('click', () => {
			console.info('Switching to Machete.');

			this.game.weapon = new MacheteWeapon(this.game.context, {
				x: 200,
				y: 200,
			});
		});

		this.laserButtonImage!.src = laserImage;
		this.laserButton?.addEventListener('click', () => {
			console.info('Switching to Laser.');

			this.game.weapon = new LaserWeapon(this.game.context, {
				x: 200,
				y: 200,
			});
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
