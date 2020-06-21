import PlankBackgroundImage from '../../assets/images/plank.png';
import Authentication from '../Authentication';
import { loadUserData } from '../services/userServices';

export default class Menu {
	private button: HTMLButtonElement = document.getElementById(
		'ui-menu-button'
	) as HTMLButtonElement;
	private buttonImage: HTMLButtonElement = document.getElementById(
		'ui-menu-button-image'
	) as HTMLButtonElement;
	private list: HTMLUListElement = document.getElementById(
		'ui-menu-item-list'
	) as HTMLUListElement;
	private listWrapper: HTMLDivElement = document.getElementById(
		'ui-options'
	) as HTMLDivElement;
	public authentication: Authentication | null = null;

	constructor(authentication: Authentication | null) {
		this.onButtonClick = this.onButtonClick.bind(this);
		this.onWindowClick = this.onWindowClick.bind(this);
		this.onListWrapperMouseEnter = this.onListWrapperMouseEnter.bind(this);

		this.authentication = authentication;
		this.start();
	}

	public start(): void {
		this.button.addEventListener('click', this.onButtonClick);
		this.listWrapper.addEventListener(
			'mouseenter',
			this.onListWrapperMouseEnter
		);
		window.addEventListener('click', this.onWindowClick);
	}

	public stop(): void {
		this.button.removeEventListener('click', this.onButtonClick);
	}

	private async onListWrapperMouseEnter(): Promise<void> {
		if (
			this.authentication?.isLoggedIn() &&
			this.authentication.isAuthenticated()
		) {
			const userID = this.authentication?.getOpaqueId();
			if (typeof userID === 'string') {
				const user = await loadUserData(
					userID,
					this.authentication.state.token
				);
				console.log(user);
			}
		}
	}

	private onWindowClick(event: MouseEvent): void {
		const isMenuOpen = this.list.classList.contains('open');
		if (!isMenuOpen) return;

		const clickedOutSideOptionsContainer = this.listWrapper.contains(
			event.target as Node
		);

		if (!clickedOutSideOptionsContainer) {
			this.list.classList.remove('open');
			this.buttonImage.classList.toggle('rotate');
		}
	}

	private onButtonClick(): void {
		this.list.style.backgroundImage = `url("${PlankBackgroundImage}")`;
		this.button.classList.toggle('rotate');
		this.list.classList.toggle('open');
	}

	public hide(): void {
		this.button.style.display = 'none';
	}

	public show(): void {
		this.button.style.display = 'block';
	}
}
