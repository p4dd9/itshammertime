import IEffectSettings from '../../interfaces/IEffectSettings';
import { setImageSrcById, setProductCostById } from '../../util/commonUtil';
import Game from '../Game';
import { fetchCheerEmotes } from '../services/twitchServices';
import { hasUsedBits } from '../services/userServices';
import TransactionListener from '../transactions/TransactionListener';
import ClassicHammer from '../weapon/weapons/ClassicHammer';
import PlantHammer from '../weapon/weapons/PlantHammer';

import HammerImage from '../../assets/images/hammer_preview.png';
import GreenHammerImage from '../../assets/images/planthammer_preview.png';
import { Product } from '../../types/twitch';
import Renderer from '../Renderer';
import GameStartStopButton from './GameStartStopButton';

export default class Shop {
	private game: Game;
	private transactionListener: TransactionListener;
	private effectSettings: IEffectSettings;
	private products: Product[] | undefined;
	private userHasUsedBits = false;
	private gameStartStopButton: GameStartStopButton;

	constructor(
		game: Game,
		effectSettings: IEffectSettings,
		gameStartStopButton: GameStartStopButton
	) {
		this.game = game;
		this.transactionListener = new TransactionListener(game);
		this.effectSettings = effectSettings;
		this.gameStartStopButton = gameStartStopButton;
	}

	private async fetchProducts() {
		return await this.game.transaction?.getProducts();
	}

	public async init(): Promise<void> {
		Renderer.renderShop();

		this.products = await this.fetchProducts();
		this.userHasUsedBits = await this.fetchUserHasUsedBits();

		this.initProductPreviewImageSources();
		this.initProductBitIntegration();
		this.addEventListeners();
	}

	private addEventListeners(): void {
		this.addClassicHammerEventListeners();

		// TODO: only if bought by user
		this.addPlantHammerEventListeners();
	}

	private initProductPreviewImageSources(): void {
		setImageSrcById('ui-shop-button-image', HammerImage);
		setImageSrcById('ui-shop-preview-classic-image', HammerImage);
		setImageSrcById('ui-shop-preview-green-image', GreenHammerImage);
	}

	private addClassicHammerEventListeners(): void {
		document.getElementById('ui-shop-preview-classic')?.addEventListener('click', () => {
			this.gameStartStopButton.startGame();
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

	private addPlantHammerEventListeners(): void {
		document.getElementById('ui-shop-preview-green')?.addEventListener('click', () => {
			this.gameStartStopButton.startGame();
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

	private async fetchUserHasUsedBits() {
		if (this.game.authentication?.isLoggedIn() && this.game.authentication.isAuthenticated()) {
			const userID = this.game.authentication?.getUserId();
			if (typeof userID === 'string') {
				return await hasUsedBits(userID, this.game.authentication.state.token);
			}
		}
		return false;
	}

	/**
	 * TODO: naming convention for products
	 *      - ID_NAME
	 *      - function identifier
	 *      - communication
	 */
	private initProductBitIntegration() {
		if (this.products === undefined) return;

		for (const product of this.products) {
			if (product.sku === 'planthammer') {
				const useBitsWrapper = document.getElementById(
					'ui-button-usebits-planthammer-button-wrapper'
				);

				if (this.userHasUsedBits) {
					(document.getElementById('ui-shop-preview-green') as HTMLElement).style.filter =
						'none';
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
