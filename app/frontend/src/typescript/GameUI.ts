import Game from './Game';
import IEffectSettings from '../interfaces/IEffectSettings';

import HammerImage from '../assets/images/hammer_preview.png';
import GreenHammerImage from '../assets/images/planthammer_preview.png';

import ClassicHammer from './weapons/ClassicHammer';
import PlantHammer from './weapons/PlantHammer';
import Menu from './ui/Menu';
import AudioButton from './ui/AudioButton';
import FaqButton from './ui/FaqButton';
import Enchantments from './ui/Enchantments';
import GameStartStopButton from './ui/GameStartStopButton';

export default class UI {
	private game: Game;
	private effectSettings: IEffectSettings;

	public menu: Menu;
	public audioButton: AudioButton;
	public faqButton: FaqButton;
	public enchantments: Enchantments;
	public gameStartStopButton: GameStartStopButton;

	constructor(game: Game, effectSettings: IEffectSettings) {
		this.game = game;
		this.effectSettings = effectSettings;

		this.menu = new Menu(game.authentication);
		this.audioButton = new AudioButton(game.audio);
		this.faqButton = new FaqButton();
		this.gameStartStopButton = new GameStartStopButton(game);
		this.enchantments = new Enchantments(game, effectSettings);
		this.show();
	}

	public async initHammerOptions(): Promise<void> {
		await this.renderHammerOptions();
		this.initHammerBits();
		this.initProducts();
	}

	private show(): void {
		(document.getElementById('ui-layer') as HTMLDivElement).style.visibility = 'visible';
	}

	private initHammerBits(): void {
		const hammerOptionsButtonImage = document.getElementById(
			'ui-shop-button-image'
		) as HTMLImageElement;

		const classicHammerPreviewImage = document.getElementById(
			'ui-shop-preview-classic-image'
		) as HTMLImageElement;

		const greenHammerPreviewImage = document.getElementById(
			'ui-shop-preview-green-image'
		) as HTMLImageElement;

		hammerOptionsButtonImage.src = HammerImage;
		classicHammerPreviewImage.src = HammerImage;
		greenHammerPreviewImage.src = GreenHammerImage;

		const classicHammerPreview = document.getElementById('ui-shop-preview-classic');
		const greenHammerPreview = document.getElementById('ui-shop-preview-green');

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

					const useBitsImage = document.getElementById('ui-button-use-bits-bit-icon');

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
							useBitsWrapper.addEventListener('mouseenter', () => {
								this.game.transaction?.showBitsBalance();
							});

							useBitsWrapper.addEventListener('click', () => {
								this.game.transaction?.useBits(product.sku);
							});
						}

						if (useBitsImage instanceof HTMLElement) {
							(useBitsImage as HTMLImageElement).src =
								twitchBitsActions.actions[0].tiers[1].images.light.static[1];
						}

						if (amountDisplayPlantHammer) {
							amountDisplayPlantHammer.innerText = String(product.cost.amount);
						}
					});
				}
			}
		}
	}

	private async renderHammerOptions(): Promise<void> {
		const hammerOptionsAnchor = document.getElementById('ui-shop');
		const templateString = (): string => {
			return `
				<div id="ui-shop" class="ui-menu-item-container" >
					<button
							id="ui-shop-button"
							class="ui-button"
						>
							<img
								id="ui-shop-button-image"
								alt="contact makers"
							/>
					</button>
					<div
						id="ui-shop-sidemenu"
						class="ui-sidemenu"
					>
						<div
							id="ui-shop-classic-hammer-page"
							class="ui-sidemenu-page"
						>
							<h5 class="ui-sidemenu-page-title">
								Classic
							</h5>
							<div
								id="ui-shop-preview-classic"
							>
								<img
									id="ui-shop-preview-classic-image"
									class="ui-shop-preview-image"
									alt="hammer-classic"
								/>
							</div>
						</div>
						<div
							id="ui-shop-classic-plant-page"
							class="ui-sidemenu-page"
						>
							<h5 class="ui-sidemenu-page-title">
								Green
							</h5>
							<div
								id="ui-shop-preview-green"
							>
								<img
									id="ui-shop-preview-green-image"
									class="ui-shop-preview-image"
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

	private render = (template: () => string, node: HTMLElement | null): void => {
		if (!(node instanceof HTMLElement)) return;
		node.innerHTML = typeof template === 'function' ? template() : template;
	};
}
