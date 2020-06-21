import Game from './Game';
import { setImg } from '../util/commonUtil';
import IEffectSettings from '../interfaces/IEffectSettings';

import HammerImage from '../assets/images/hammer_preview.png';
import GreenHammerImage from '../assets/images/planthammer_preview.png';
import BookImage from '../assets/images/book.png';

import { IVanillaColor } from '../interfaces/IVanillaPickerColor';
import Picker from 'vanilla-picker';
import ClassicHammer from './weapons/ClassicHammer';
import PlantHammer from './weapons/PlantHammer';
import { loadUserData } from './services/userServices';
import Menu from './ui/Menu';
import AudioButton from './ui/AudioButton';
import FaqButton from './ui/FaqButton';

export default class UI {
	private game: Game;
	private effectSettings: IEffectSettings;
	private throttleId: undefined | number = undefined;
	private delay = 55;

	public menu: Menu;
	public audioButton: AudioButton;
	public faqButton: FaqButton;

	constructor(game: Game, effectSettings: IEffectSettings) {
		this.game = game;
		this.effectSettings = effectSettings;

		this.menu = new Menu();
		this.audioButton = new AudioButton(this.game.audio);
		this.faqButton = new FaqButton();
		this.initCanvasEvents();
		this.initEnchantmentsButton();
		this.showUI();
	}

	public async initHammerOptions(): Promise<void> {
		await this.renderHammerOptions();
		this.initHammerBits();
		this.initProducts();
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

			optionsContainer.addEventListener('mouseenter', async () => {
				if (
					this.game.authentication?.isLoggedIn() &&
					this.game.authentication.isAuthenticated()
				) {
					const userID = this.game.authentication?.getOpaqueId();
					if (typeof userID === 'string') {
						const user = await loadUserData(
							userID,
							this.game.authentication.state.token
						);
						console.log(user);
					}
				}
			});
		}
	}

	private initHammerBits(): void {
		const hammerOptionsButtonImage = document.getElementById(
			'ui-hammer-options-button-image'
		);

		const classicHammerPreviewImage = document.getElementById(
			'ui-hammer-options-preview-classic-image'
		);

		const classicHammerPreview = document.getElementById(
			'ui-hammer-options-preview-classic'
		);

		const greenHammerPreviewImage = document.getElementById(
			'ui-hammer-options-preview-green-image'
		);

		const greenHammerPreview = document.getElementById(
			'ui-hammer-options-preview-green'
		);

		setImg(hammerOptionsButtonImage, HammerImage);
		setImg(classicHammerPreviewImage, HammerImage);
		setImg(greenHammerPreviewImage, GreenHammerImage);

		if (classicHammerPreview) {
			classicHammerPreview.addEventListener('click', () => {
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

		if (greenHammerPreview) {
			greenHammerPreview.addEventListener('click', () => {
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

	private async initProducts(): Promise<void> {
		const products = await this.game.transaction?.getProducts();

		if (products !== undefined) {
			for (const product of products) {
				if (product.sku === 'planthammer') {
					const amountDisplayPlantHammer = document.getElementById(
						'ui-button-use-bits-planthammer'
					);

					const useBitsImage = document.getElementById(
						'ui-button-use-bits-bit-icon'
					);

					const useBitsWrapper = document.getElementById(
						'ui-button-use-bits-plant-wrapper'
					);

					this.game.twitch?.onAuthorized(async (auth) => {
						const twitchBitsActionsResponse = await fetch(
							'https://api.twitch.tv/v5/bits/actions',
							{
								headers: {
									'Client-ID': auth.clientId,
								},
							}
						);

						const twitchBitsActions = await twitchBitsActionsResponse.json();

						if (useBitsWrapper instanceof HTMLElement) {
							useBitsWrapper.addEventListener(
								'mouseenter',
								() => {
									this.game.transaction?.showBitsBalance();
								}
							);

							useBitsWrapper.addEventListener('click', () => {
								this.game.transaction?.useBits(product.sku);
							});
						}

						if (useBitsImage instanceof HTMLElement) {
							(useBitsImage as HTMLImageElement).src =
								twitchBitsActions.actions[0].tiers[1].images.light.static[1];
						}

						if (amountDisplayPlantHammer) {
							amountDisplayPlantHammer.innerText = String(
								product.cost.amount
							);
						}
					});
				}
			}
		}
	}

	private async renderHammerOptions(): Promise<void> {
		const hammerOptionsAnchor = document.getElementById(
			'ui-hammer-options'
		);
		const templateString = (): string => {
			return `
				<div id="ui-hammer-options" class="ui-hint-container" >
					<button
							id="ui-hammer-options-button"
							class="ui-button"
						>
							<img
								id="ui-hammer-options-button-image"
								alt="contact makers"
							/>
					</button>
					<div
						id="ui-hammer-options-button-hint"
						class="ui-button-hint"
					>
						<div
							id="ui-hammer-options-classic-hammer-page"
							class="ui-button-hint-page"
						>
							<h5 class="ui-button-hintpage-title">
								Classic
							</h5>
							<div
								id="ui-hammer-options-preview-classic"
							>
								<img
									id="ui-hammer-options-preview-classic-image"
									class="ui-hammer-options-preview-image"
									alt="hammer-classic"
								/>
							</div>
						</div>
						<div
							id="ui-hammer-options-classic-plant-page"
							class="ui-button-hint-page"
						>
							<h5 class="ui-button-hintpage-title">
								Green
							</h5>
							<div
								id="ui-hammer-options-preview-green"
							>
								<img
									id="ui-hammer-options-preview-green-image"
									class="ui-hammer-options-preview-image"
									alt="hammer-green"
								/>
							</div>

							<div
								id="ui-button-use-bits-plant-wrapper"
								class="ui-button-use-bits-wrapper"
							>
								<div
									class="ui-button-use-bits-content-wrapper"
								>
									<img
										id="ui-button-use-bits-bit-icon"
										alt="use-bits"
									/>
									<div
										id="ui-button-use-bits-planthammer"
									></div>
								</div>
							</div>
						</div>
					</div>
				<div>
			`;
		};

		this.render(templateString, hammerOptionsAnchor);
	}

	private render = (
		template: () => string,
		node: HTMLElement | null
	): void => {
		if (!(node instanceof HTMLElement)) return;
		node.innerHTML = typeof template === 'function' ? template() : template;
	};
}
