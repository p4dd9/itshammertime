import BookImage from '../../assets/images/book.png';
import { IVanillaColor } from '../../interfaces/IVanillaPickerColor';
import Picker from 'vanilla-picker';
import Game from '../Game';
import IEffectSettings from '../../interfaces/IEffectSettings';

export default class Enchantments {
	private game: Game;
	private effectSettings: IEffectSettings;
	private throttleId: undefined | number = undefined;
	private static readonly colorOnChangeDelay = 55;

	private menuButton = document.getElementById(
		'ui-enchantments-button'
	) as HTMLButtonElement;
	private menuButtonImage = document.getElementById(
		'ui-enchantments-button-image'
	) as HTMLImageElement;
	private colorButtons = document.getElementsByClassName(
		'ui-enchantments-color-button'
	) as HTMLCollectionOf<Element>;
	private shapeButtons = document.getElementsByClassName(
		'ui-hintpage-enchantment-button'
	) as HTMLCollectionOf<Element>;
	private colorPickerElement = document.getElementById(
		'ui-enchantments-color-picker'
	) as HTMLElement;
	private colorPicker = new Picker(this.colorPickerElement);

	constructor(game: Game, effectSettings: IEffectSettings) {
		this.game = game;
		this.effectSettings = effectSettings;
		this.start();
	}

	public start(): void {
		this.menuButtonImage.src = BookImage;
		
		this.addColorPickerChangeListener();
		this.addColorPickerOnCloseListener();

		this.addColorChangePreviewListener();
		this.addShapeChangePreviewListener();
	}

	private addColorPickerOnCloseListener(): void {
		this.colorPicker.onClose = (): void => {
			clearTimeout(this.throttleId);
		};
	}

	private addColorPickerChangeListener(): void {
		this.colorPicker.onChange = (color: IVanillaColor): void => {
			this.throttle(() => {
				this.colorPickerElement.style.backgroundColor = color.rgbaString;
				this.effectSettings.particleTheme = color.rgbaString;
				this.game.weapon.moveTo(this.game.center());
				this.game.weapon.use();
			}, Enchantments.colorOnChangeDelay);
		};
	}

	private addColorChangePreviewListener(): void {
		for (const enchantmentColorButton of Array.from(this.colorButtons)) {
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
	}

	private addShapeChangePreviewListener(): void {
		for (const enchantmentShapeButton of Array.from(this.shapeButtons)) {
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

	public hideMenuButton(): void {
		this.menuButton.style.display = 'none';
	}

	public showMenuButton(): void {
		this.menuButton.style.display = 'block';
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
}
