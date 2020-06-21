import FaqImage from '../../assets/images/faq_questionmark.png';

export default class FaqButton {
	private button: HTMLElement = document.getElementById(
		'ui-faq-button'
	) as HTMLButtonElement;

	constructor() {
		this.start();
	}

	public start(): void {
		const faqButtonImage = this.button
			.firstElementChild as HTMLImageElement;
		faqButtonImage.src = FaqImage;
	}

	public hide(): void {
		this.button.style.display = 'none';
	}

	public show(): void {
		this.button.style.display = 'block';
	}
}
