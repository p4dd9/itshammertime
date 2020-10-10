import FaqImage from '../../assets/images/faq_questionmark.png';

export default class FaqButton {
	private button: HTMLButtonElement = document.getElementById(
		'ui-faq-button'
	) as HTMLButtonElement;
	private buttonImage: HTMLImageElement = document.getElementById(
		'ui-faq-button-image'
	) as HTMLImageElement;

	constructor() {
		this.start();
	}

	public start(): void {
		this.buttonImage.src = FaqImage
	}

	public hide(): void {
		this.button.style.display = 'none';
	}

	public show(): void {
		this.button.style.display = 'block';
	}
}
