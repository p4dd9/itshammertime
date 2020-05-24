import Game from './Game';
import GameAudio from './GameAudio';
import LocalStorageUtil from '../util/LocalStorageUtil';
import { setImg } from '../util/commonUtil';
import IEffectSettings from '../interfaces/IEffectSettings';

import VolumeOn from '../assets/audio/volume-on.wav';
import VolumeLowImage from '../assets/icons/volume-low.svg';
import VolumeOffImage from '../assets/icons/volume-mute.svg';
import VolumeMediumImage from '../assets/icons/volume-medium.svg';
import VolumeHighImage from '../assets/icons/volume-high.svg';

import PlankBackgroundImage from '../assets/images/plank.png';
import HammerImage from '../assets/images/hammer_preview.png';
import GreenHammerImage from '../assets/images/planthammer_preview.png';
import FaqImage from '../assets/images/faq_questionmark.png';
import BookImage from '../assets/images/book.png';

import { IVanillaColor } from '../interfaces/IVanillaPickerColor';
import Picker from 'vanilla-picker';
import ClassicHammer from './weapons/ClassicHammer';
import PlantHammer from './weapons/PlantHammer';

export default class UI {
	private game: Game;
	private effectSettings: IEffectSettings;
	private throttleId: undefined | number = undefined;
	private delay = 55;

	constructor(game: Game, effectSettings: IEffectSettings) {
		this.game = game;
		this.effectSettings = effectSettings;
		this.start();
	}

	private start(): void {
		this.initHammerOptions();
		this.initMenuButton();
		this.initAudioButton();
		this.initFaqButton();
		this.initCanvasEvents();
		this.initEnchantmentsButton();

		this.showUI();
	}

	private showUI(): void {
		const ui = document.getElementById('ui-layer');
		if (ui instanceof HTMLDivElement) {
			ui.style.visibility = 'visible';
		}
	}

	private throttle = (callback: () => void, delay: number): void => {
		if (this.throttleId) {
			return;
		}

		this.throttleId = window.setTimeout(() => {
			callback();
			this.throttleId = undefined;
		}, delay);
	};

	private initEnchantmentsButton(): void {
		const enchantmentsButton = document.getElementById(
			'ui-enchantments-button'
		);
		const enchantmentColorButtons = document.getElementsByClassName(
			'ui-enchantments-color-button'
		);
		const enchantmentShapeButtons = document.getElementsByClassName(
			'ui-hintpage-enchantment-button'
		);

		const enchantmentColorPicker = document.getElementById(
			'ui-enchantments-color-picker'
		);

		if (enchantmentsButton instanceof HTMLButtonElement) {
			const enchantmentsButtonImage = enchantmentsButton.firstElementChild as HTMLImageElement;
			enchantmentsButtonImage.src = BookImage;
		}

		if (enchantmentColorPicker instanceof HTMLDivElement) {
			const picker = new Picker(enchantmentColorPicker);
			picker.onChange = (color: IVanillaColor): void => {
				this.throttle(() => {
					enchantmentColorPicker.style.backgroundColor =
						color.rgbaString;
					this.effectSettings.particleTheme = color.rgbaString;
					this.game.weapon.moveTo(this.game.center());
					this.game.weapon.use();
				}, this.delay);
			};

			picker.onClose = (): void => {
				clearTimeout(this.throttleId);
			};
		}

		for (const enchantmentColorButton of Array.from(
			enchantmentColorButtons
		)) {
			if (enchantmentColorButton instanceof HTMLButtonElement) {
				enchantmentColorButton.addEventListener(
					'click',
					(event: MouseEvent) => {
						this.effectSettings.particleTheme = (event.target as HTMLButtonElement).value;
						this.game.weapon.moveTo(this.game.center());
						this.game.weapon.use();
					}
				);
			}
		}

		for (const enchantmentShapeButton of Array.from(
			enchantmentShapeButtons
		)) {
			if (enchantmentShapeButton instanceof HTMLButtonElement) {
				enchantmentShapeButton.addEventListener(
					'click',
					(event: MouseEvent) => {
						this.effectSettings.shape = (event.target as HTMLButtonElement)
							.value as 'circle' | 'star' | 'square';
						this.game.weapon.moveTo(this.game.center());
						this.game.weapon.use();
					}
				);
			}
		}
	}

	private initCanvasEvents(): void {
		const optionsContainer = document.getElementById('ui-options');

		if (optionsContainer instanceof HTMLElement) {
			window.addEventListener('click', (event: MouseEvent) => {
				const isMenuOpen = document
					.getElementById('ui-menu-item-list')
					?.classList.contains('open');
				if (!isMenuOpen) return;

				const clickedOutSideOptionsContainer = optionsContainer.contains(
					event.target as Node
				);
				if (!clickedOutSideOptionsContainer) {
					document
						.getElementById('ui-menu-item-list')
						?.classList.remove('open');
					document
						.getElementById('ui-menu-button-image')
						?.classList.toggle('rotate');
				}
			});
		}
	}

	private initFaqButton(): void {
		const faqButton = document.getElementById('ui-faq-button');

		if (faqButton instanceof HTMLButtonElement) {
			const faqButtonImage = faqButton.firstElementChild as HTMLImageElement;
			faqButtonImage.src = FaqImage;
		}
	}

	private initMenuButton(): void {
		const menuButton = document.getElementById('ui-menu-button');

		if (menuButton instanceof HTMLButtonElement) {
			const menuList = document.getElementById(
				'ui-menu-item-list'
			) as HTMLUListElement;

			menuList.style.backgroundImage = `url("${PlankBackgroundImage}")`;

			menuButton.addEventListener('click', () => {
				menuButton.classList.toggle('rotate');
				menuList.classList.toggle('open');
			});
		}
	}

	private initHammerOptions(): void {
		const hammerOptionsButtonImage = document.getElementById(
			'ui-hammer-options-button-image'
		);

		const classicHammerPreviewImage = document.getElementById(
			'ui-hammer-options-preview-classic'
		);

		const greenHammerPreviewImage = document.getElementById(
			'ui-hammer-options-preview-green'
		);

		setImg(hammerOptionsButtonImage, HammerImage);
		setImg(classicHammerPreviewImage, HammerImage);
		setImg(greenHammerPreviewImage, GreenHammerImage);

		const classicHammerPage = document.getElementById(
			'ui-hammer-options-classic-hammer-page'
		);

		const plantHammerPage = document.getElementById(
			'ui-hammer-options-classic-plant-page'
		);

		if (classicHammerPage) {
			classicHammerPage.addEventListener('click', () => {
				this.effectSettings.particleTheme = 'glass';
				this.effectSettings.shape = 'square';
				this.game.weapon = new ClassicHammer(
					this.game.contexts,
					this.game.center(),
					this.effectSettings,
					this.game.audio
				);
			});
		}

		if (plantHammerPage) {
			plantHammerPage.addEventListener('click', () => {
				this.effectSettings.particleTheme = 'plant';
				this.effectSettings.shape = 'leaf';
				this.game.weapon = new PlantHammer(
					this.game.contexts,
					this.game.center(),
					this.effectSettings,
					this.game.audio
				);
			});
		}
	}

	private initAudioButton(): void {
		const audioButton = document.getElementById('ui-audio-button');

		const volumeIndex = LocalStorageUtil.initVolumeIndex();
		this.setAudioButtonImage(volumeIndex);
		const volumeSound = new Audio();
		volumeSound.src = VolumeOn;

		if (audioButton instanceof HTMLButtonElement) {
			audioButton.addEventListener('click', () => {
				const newVolumeIndex: number =
					(this.game.audio.volumeIndex + 1) %
					GameAudio.volumeRange.length;

				this.game.audio.volumeIndex = newVolumeIndex;
				volumeSound.volume =
					GameAudio.volumeRange[newVolumeIndex] +
					(newVolumeIndex === 0 ? 0 : 0.35);
				LocalStorageUtil.setVolumeIndex(newVolumeIndex);
				this.game.audio.playSoundOverlap(volumeSound);
			});
		}
	}

	public setAudioButtonImage(volumeIndex: number): void {
		const audioButtonImage = document.getElementById(
			'ui-audio-button-image'
		);
		if (audioButtonImage instanceof HTMLImageElement) {
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
}
