import PlankBackgroundImage from '../../assets/images/plank.png';
import Authentication from '../Authentication';

export default class Menu {
	private button: HTMLButtonElement = document.getElementById(
		'ui-menu-button'
	) as HTMLButtonElement;
	private list: HTMLUListElement = document.getElementById(
		'ui-menu-item-list'
	) as HTMLUListElement;
	private listWrapper: HTMLDivElement = document.getElementById('ui-options') as HTMLDivElement;
	public authentication: Authentication | null = null;

	constructor(authentication: Authentication | null) {
		this.onButtonClick = this.onButtonClick.bind(this);
		this.onWindowClick = this.onWindowClick.bind(this);

		this.authentication = authentication;
		this.start();
	}

	public start(): void {
		this.list.style.backgroundImage = `url("${PlankBackgroundImage}")`;
		this.button.addEventListener('click', this.onButtonClick);
		window.addEventListener('click', this.onWindowClick);
	}

	public stop(): void {
		this.button.removeEventListener('click', this.onButtonClick);
		window.removeEventListener('click', this.onWindowClick);
	}

	private onWindowClick(event: MouseEvent): void {
		const isMenuOpen = this.list.classList.contains('open');
		if (!isMenuOpen) return;

		const clickedOutSideOptionsContainer = this.listWrapper.contains(event.target as Node);

		if (!clickedOutSideOptionsContainer) {
			this.list.classList.remove('open');
			this.button.classList.toggle('rotate');
		}
	}

	private onButtonClick(): void {
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
