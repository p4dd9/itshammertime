import PlankBackgroundImage from '../../assets/images/plank.png';

export default class Menu {
	private button: HTMLElement = document.getElementById(
		'ui-menu-button'
	) as HTMLButtonElement;
	private list: HTMLUListElement = document.getElementById(
		'ui-menu-item-list'
	) as HTMLUListElement;

	constructor() {
		this.onClick = this.onClick.bind(this);
		this.start();
	}

	public start(): void {
		this.button.addEventListener('click', this.onClick);
	}

	public stop(): void {
		this.button.removeEventListener('click', this.onClick);
	}

	private onClick(): void {
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
