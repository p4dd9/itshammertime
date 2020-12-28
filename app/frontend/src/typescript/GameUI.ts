import Game from './Game';
import IEffectSettings from '../interfaces/IEffectSettings';

import HammerImage from '../assets/images/hammer_preview.png';
import GreenHammerImage from '../assets/images/planthammer_preview.png';

import ClassicHammer from './weapon/weapons/ClassicHammer';
import PlantHammer from './weapon/weapons/PlantHammer';
import Menu from './ui/Menu';
import AudioButton from './ui/AudioButton';
import FaqButton from './ui/FaqButton';
import Enchantments from './ui/Enchantments';
import GameStartStopButton from './ui/GameStartStopButton';
import { hasUsedBits } from './services/userServices';
import TransactionListener from './transactions/TransactionListener';
import { fetchCheerEmotes } from './services/twitchServices';
import Renderer from './Renderer';
import { setImageSrcById, setProductCostById, setVisibilityById } from '../util/commonUtil';

export default class UI {
	private game: Game;
	private effectSettings: IEffectSettings;
	private transactionListener: TransactionListener;

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
		this.transactionListener = new TransactionListener(game);
		this.showUI();
	}

	public async initShop(): Promise<void> {
		Renderer.renderShop();
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
							const twitchBitsActions = await fetchCheerEmotes(auth.clientId);

							if (useBitsWrapper instanceof HTMLElement && twitchBitsActions) {
								Renderer.renderUseBitsButton();
								Renderer.renderBitsUsedCheer();

								const useBitsIcon =
									twitchBitsActions.actions[0].tiers[1].images.light.static[1];
								const usedBitsCheerIcon =
									twitchBitsActions.actions[2].tiers[1].images.light.animated[2];
								setImageSrcById('ui-button-use-bits-bit-icon', useBitsIcon);
								setImageSrcById('ui-bit-used-cheer', usedBitsCheerIcon);

								const {
									sku,
									cost: { amount },
								} = product;
								setProductCostById('ui-button-use-bits-planthammer', amount);

								this.transactionListener.addBitsBalanceListener(useBitsWrapper);
								this.transactionListener.addUseBitsListener(useBitsWrapper, sku);
							}
						});
					}
				}
			}
		}
	}

	private showUI() {
		setVisibilityById('ui-layer', 'visible');
	}
}
