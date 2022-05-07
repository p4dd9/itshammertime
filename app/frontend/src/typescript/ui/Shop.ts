import IEffectSettings from '../../interfaces/IEffectSettings';
import { setImageSrcById, setProductCostById } from '../../util/commonUtil';
import Game from '../Game';
import { fetchCheerEmotes } from '../services/twitchServices';
import { loadUserData } from '../services/userServices';
import TransactionListener from '../transactions/TransactionListener';
import ClassicHammer from '../weapon/weapons/ClassicHammer';
import WoodyHammer from '../weapon/weapons/WoodyHammer';

import ClassicHammerPreviewImage from '../../assets/images/hammer_preview.png';
import WoodyHammerPreviewImage from '../../assets/images/woodyhammer_preview.png';
import { Product } from '../../types/twitch';
import Renderer from '../Renderer';
import GameStartStopButton from './GameStartStopButton';
import UserDTO from '../../../../backend/src/dto/UserDTO';

export default class Shop {
	private game: Game;
	private transactionListener: TransactionListener;
	private effectSettings: IEffectSettings;
	private products: Product[] | undefined;
	private user: UserDTO | null | undefined = null;
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
		this.user = await this.fetchUser();

		this.initProductPreviewImageSources();
		this.initProductBitIntegration();
		this.addEventListeners();
	}

	private addEventListeners(): void {
		this.addClassicHammerEventListeners();

		// TODO: only if bought by user
		this.addWoodyHammerEventListeners();
	}

	private initProductPreviewImageSources(): void {
		setImageSrcById('ui-shop-button-image', ClassicHammerPreviewImage);
		setImageSrcById('ui-shop-preview-classic-image', ClassicHammerPreviewImage);
		setImageSrcById('ui-shop-preview-woody-image', WoodyHammerPreviewImage);
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

	private addWoodyHammerEventListeners(): void {
		document.getElementById('ui-shop-preview-woody')?.addEventListener('click', () => {
			this.gameStartStopButton.startGame();
			this.effectSettings.particleTheme = 'plant';
			this.effectSettings.shape = 'leaf';
			this.game.weapon = new WoodyHammer(
				this.game.contexts,
				this.game.center(),
				this.effectSettings,
				this.game.audio
			);
		});
	}

	private async fetchUser() {
		if (this.game.authentication?.isLoggedIn() && this.game.authentication.isAuthenticated()) {
			const userID = this.game.authentication?.getUserId();
			if (typeof userID === 'string') {
				try {
					const userData = await loadUserData(
						userID,
						this.game.authentication.state.token
					);
					this.user = userData;
					if (this.user) {
						this.renderUserDebugInfo(this.user);
					}
				} catch (e) {
					console.log(e);
					return null;
				}
			}
		}
		return null;
	}

	private renderUserDebugInfo(userData: UserDTO) {
		const debugUserBitsElement = document.getElementById('debug-user-bits');
		const debugUserIdElement = document.getElementById('debug-user-id');

		if (debugUserBitsElement) {
			debugUserBitsElement.textContent = `${userData.bit_count}`;
		}

		if (debugUserIdElement) {
			debugUserIdElement.textContent = `${userData.id}`;
		}
	}

	/**
	 * TODO: naming convention for products
	 *      - ID_NAME
	 *      - function identifier
	 *      - communication
	 */
	private async initProductBitIntegration() {
		if (this.products === undefined) return;

		for (const product of this.products) {
			if (product.sku === 'woodyhammer') {
				const useBitsWrapper = document.getElementById(
					'ui-button-usebits-woodyhammer-button-wrapper'
				);

				if (this.user?.products.includes('woodyhammer')) {
					(document.getElementById('ui-shop-preview-woody') as HTMLElement).style.filter =
						'none';
				} else {
					this.game.twitch?.onAuthorized(async () => {
						const twitchBitsActions = await fetchCheerEmotes();

						if (useBitsWrapper instanceof HTMLElement && twitchBitsActions) {
							Renderer.renderUseBitsButton();

							const useBitsIcon = twitchBitsActions.tier1.bit;
							setImageSrcById('ui-button-use-bits-bit-icon', useBitsIcon);

							const {
								sku,
								cost: { amount },
							} = product;
							setProductCostById('ui-button-use-bits-woodyhammer', amount);

							this.transactionListener.addBitsBalanceListener(useBitsWrapper);
							this.transactionListener.addUseBitsListener(useBitsWrapper, sku);
						}
					});
				}
			}
		}
	}
}
