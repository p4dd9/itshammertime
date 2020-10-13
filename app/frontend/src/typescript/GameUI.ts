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
import { hasUsedBits } from './services/userServices';
import ICheerEmotesResponse from '../interfaces/ICheerEmotes';
import { onSuccessfulClassicPlantHammerTransaction } from '../util/commonUtil';

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

	public async initShop(): Promise<void> {
		await this.renderShop();
		this.initProducts();
		this.initProductBitIntegration();
	}

	private initProducts(): void {
		this.initProductPreviewImageSources();
		this.addClassicHammerShopProduct();
		this.addGreenHammerShopProduct();
	}

	private initProductPreviewImageSources(): void {
		(document.getElementById('ui-shop-button-image') as HTMLImageElement).src = HammerImage;

		(document.getElementById(
			'ui-shop-preview-classic-image'
		) as HTMLImageElement).src = HammerImage;

		(document.getElementById(
			'ui-shop-preview-green-image'
		) as HTMLImageElement).src = GreenHammerImage;
	}

	private addClassicHammerShopProduct(): void {
		document.getElementById('ui-shop-preview-classic')?.addEventListener('click', () => {
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

	private addGreenHammerShopProduct(): void {
		document.getElementById('ui-shop-preview-green')?.addEventListener('click', () => {
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

	private async initProductBitIntegration(): Promise<void> {
		const products = await this.game.transaction?.getProducts();

		if (products !== undefined) {
			for (const product of products) {
				if (product.sku === 'planthammer') {
					const useBitsWrapper = document.getElementById(
						'ui-button-use-bits-plant-wrapper'
					);
					let usedBits = false;
					if (
						this.game.authentication?.isLoggedIn() &&
						this.game.authentication.isAuthenticated()
					) {
						const userID = this.game.authentication?.getUserId();
						if (typeof userID === 'string') {
							usedBits = await hasUsedBits(
								userID,
								this.game.authentication.state.token
							);
						}
					}
					if (usedBits) {
						(document.getElementById(
							'ui-shop-preview-green'
						) as HTMLElement).style.filter = 'none';
					} else {
						this.game.twitch?.onAuthorized(async (auth) => {
							const twitchBitsActions = await this.fetchCheerEmotes(auth.clientId);
							if (useBitsWrapper instanceof HTMLElement && twitchBitsActions) {
								// render not-used-bits user ui
								await this.renderUseBitsButton();
								await this.renderBitsUsedCheer();
								this.renderProductBitImage(
									twitchBitsActions.actions[0].tiers[1].images.light.static[1]
								);
								this.renderBitUseSuccess(
									twitchBitsActions.actions[2].tiers[1].images.light.animated[2]
								);
								this.renderProductCost(
									document.getElementById('ui-button-use-bits-planthammer'),
									product.cost.amount
								);

								// add shop ui specific listeners
								this.addBitsBalanceListener(useBitsWrapper);
								this.addUseBitsListener(useBitsWrapper, product.sku);
							}
						});
					}
				}
			}
		}
	}

	private async renderBitsUsedCheer(): Promise<void> {
		const useBitsButtonAnchor = document.getElementById(
			'ui-shop-classic-plant-page-cheer-anchor'
		);

		const templateString = (): string => {
			return `<img id="ui-bit-used-cheer" src="" />`;
		};

		this.render(templateString, useBitsButtonAnchor);
	}

	private renderBitUseSuccess(src: string): void {
		(document.getElementById('ui-bit-used-cheer') as HTMLImageElement).src = src;
	}

	private renderProductBitImage(src: string): void {
		(document.getElementById('ui-button-use-bits-bit-icon') as HTMLImageElement).src = src;
	}

	private renderProductCost(element: HTMLElement | null, price: number): void {
		if (element) {
			element.innerText = String(price);
		}
	}

	private async fetchCheerEmotes(clientId: string): Promise<ICheerEmotesResponse | undefined> {
		try {
			const twitchBitsActionsResponse = await fetch(
				'https://api.twitch.tv/kraken/bits/actions',
				{
					headers: {
						'Client-ID': clientId,
						Accept: ' application/vnd.twitchtv.v5+json',
					},
				}
			);

			return await twitchBitsActionsResponse.json();
		} catch (e) {
			console.log(e);
		}
	}

	private addUseBitsListener(element: HTMLElement, sku: string): void {
		element.addEventListener('click', () => {
			// TODO remove for hosted env
			onSuccessfulClassicPlantHammerTransaction();
			this.game.transaction?.useBits(sku);
		});
	}

	private addBitsBalanceListener(element: HTMLElement): void {
		element.addEventListener('mouseenter', () => {
			this.game.transaction?.showBitsBalance();
		});
	}

	private async renderUseBitsButton(): Promise<void> {
		const useBitsButtonAnchor = document.getElementById('ui-button-use-bits-plant-wrapper');

		const templateString = (): string => {
			return `
					<div class="ui-button-use-bits-content-wrapper">
						<img
							id="ui-button-use-bits-bit-icon"
							alt="use-bits"
						/>
						<div id="ui-button-use-bits-planthammer"></div>
					</div>
			`;
		};

		this.render(templateString, useBitsButtonAnchor);
	}

	private async renderShop(): Promise<void> {
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
							<div id="ui-shop-classic-plant-page-cheer-anchor"></div>
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
							></div>
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

	private show(): void {
		(document.getElementById('ui-layer') as HTMLDivElement).style.visibility = 'visible';
	}
}
