export default class Renderer {
	public static renderBitsUsedCheer(): void {
		const useBitsButtonAnchor = document.getElementById('ui-shop-planthammer-onbuy-cheeremote');
		const templateString = (): string => {
			return `<img id="ui-bit-used-cheer" src="" />`;
		};
		Renderer.render(templateString, useBitsButtonAnchor);
	}

	public static renderUseBitsButton(): void {
		const useBitsButtonAnchor = document.getElementById(
			'ui-button-usebits-planthammer-button-wrapper'
		);
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

		Renderer.render(templateString, useBitsButtonAnchor);
	}

	public static renderShop(): void {
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
							<div id="ui-shop-planthammer-onbuy-cheeremote"></div>
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
								id="ui-button-usebits-planthammer-button-wrapper"
								class="ui-button-use-bits-wrapper"
							></div>
						</div>
					</div>
				<div>
			`;
		};

		Renderer.render(templateString, hammerOptionsAnchor);
	}

	private static render = (template: () => string, node: HTMLElement | null): void => {
		if (!(node instanceof HTMLElement)) return;
		node.innerHTML = typeof template === 'function' ? template() : template;
	};
}
