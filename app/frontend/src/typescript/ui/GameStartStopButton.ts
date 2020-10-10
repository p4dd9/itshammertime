import Game from '../Game';
import EyeOff from '../../assets/images/eye-off-outline.svg';
import EyeOn from '../../assets/images/eye-outline.svg';

export default class GameStartStopButton {
	private button: HTMLElement = document.getElementById(
		'ui-activate-button'
	) as HTMLButtonElement;

	private buttonImage: HTMLImageElement = document.getElementById(
		'ui-activate-button-image'
	) as HTMLImageElement;
	private game: Game;

	constructor(game: Game) {
		this.game = game;
		this.onClick = this.onClick.bind(this);

		this.start();
	}

	private onClick(): void {
		if (this.game.activated) {
			this.game.activated = !this.game.activated;
			this.buttonImage.src = EyeOff;
			this.game.stop();
		} else {
			this.game.activated = !this.game.activated;
			this.buttonImage.src = EyeOn;
			this.game.start();
			this.game.resize(); // remove listener, wtf how does this work
		}
	}

	public start(): void {
		this.buttonImage.src = EyeOff;
		this.button.addEventListener('click', this.onClick);
	}

	public stop(): void {
		this.button.removeEventListener('click', this.onClick);
	}
}
