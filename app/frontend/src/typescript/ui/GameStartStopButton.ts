import Game from '../Game';

export default class GameStartStopButton {
	private button: HTMLElement = document.getElementById(
		'ui-activate-button'
	) as HTMLButtonElement;
	private game: Game;

	constructor(game: Game) {
		this.game = game;
		this.onClick = this.onClick.bind(this);

		this.start();
	}

	private onClick(): void {
		console.log('hi');

		if (this.game.activated) {
			this.game.activated = !this.game.activated;
			this.button.innerText = 'show';
			this.game.stop();
		} else {
			this.game.activated = !this.game.activated;
			this.button.innerText = 'hide';
			this.game.start();
			this.game.resize(); // remove listener, wtf how does this work
		}
	}

	public start(): void {
		this.button.innerText = 'show';
		this.button.addEventListener('click', this.onClick);
	}

	public stop(): void {
		this.button.removeEventListener('click', this.onClick);
	}
}
