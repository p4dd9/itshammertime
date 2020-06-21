import Game from './Game';
import { setImg } from '../util/commonUtil';
import IEffectSettings from '../interfaces/IEffectSettings';

import HammerImage from '../assets/images/hammer_preview.png';
import GreenHammerImage from '../assets/images/planthammer_preview.png';

import ClassicHammer from './weapons/ClassicHammer';
import PlantHammer from './weapons/PlantHammer';
import Menu from './ui/Menu';
import AudioButton from './ui/AudioButton';
import FaqButton from './ui/FaqButton';
import Enchantments from './ui/Enchantments';

export default class UI {
	private game: Game;
	private effectSettings: IEffectSettings;

	public menu: Menu;
	public audioButton: AudioButton;
	public faqButton: FaqButton;
	public enchantments: Enchantments;

	constructor(game: Game, effectSettings: IEffectSettings) {
		this.game = game;
		this.effectSettings = effectSettings;

		this.menu = new Menu(game.authentication);
		this.audioButton = new AudioButton(game.audio);
		this.faqButton = new FaqButton();
		this.enchantments = new Enchantments(game, effectSettings);
		this.show();
	}

	public async initHammerOptions(): Promise<void> {
		await this.renderHammerOptions();
		this.initHammerBits();
		this.initProducts();
	}

	private show(): void {
		(document.getElementById(
			'ui-layer'
		) as HTMLDivElement).style.visibility = 'visible';
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
