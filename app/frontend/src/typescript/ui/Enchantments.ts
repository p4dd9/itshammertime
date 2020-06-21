import BookImage from '../../assets/images/book.png';
import { IVanillaColor } from '../../interfaces/IVanillaPickerColor';
import Picker from 'vanilla-picker';
import Game from '../Game';
import IEffectSettings from '../../interfaces/IEffectSettings';

export default class Enchantments {
	private game: Game;
	private effectSettings: IEffectSettings;
	private throttleId: undefined | number = undefined;
	private delay = 55;

	private menuButton = document.getElementById(
		'ui-enchantments-button'
	) as HTMLButtonElement;
	private colorButtons = document.getElementsByClassName(
		'ui-enchantments-color-button'
	) as HTMLCollectionOf<Element>;
	private shapeButtons = document.getElementsByClassName(
		'ui-hintpage-enchantment-button'
	) as HTMLCollectionOf<Element>;
	private colorPicker = document.getElementById(
		'ui-enchantments-color-picker'
	) as HTMLElement;

	constructor(game: Game, effectSettings: IEffectSettings) {
		this.game = game;
		this.effectSettings = effectSettings;
		this.start();
	}

	public start(): void {
		const enchantmentsButtonImage = this.menuButton
			.firstElementChild as HTMLImageElement;
		enchantmentsButtonImage.src = BookImage;

		const picker = new Picker(this.colorPicker);
		picker.onChange = (color: IVanillaColor): void => {
			this.throttle(() => {
				this.colorPicker.style.backgroundColor = color.rgbaString;
				this.effectSettings.particleTheme = color.rgbaString;
				this.game.weapon.moveTo(this.game.center());
				this.game.weapon.use();
			}, this.delay);
		};

		picker.onClose = (): void => {
			clearTimeout(this.throttleId);
		};

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

	public hide(): void {
		this.menuButton.style.display = 'none';
	}

	public show(): void {
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
