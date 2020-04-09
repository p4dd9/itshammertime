import '../styles/video_overlay.scss';
import Game from '../typescript/Game';

window.onload = (): void => {
	const bodyMarginVerticalHorizontal = 16;

	const root: HTMLElement | null = document.getElementById('game-layer');
	if (root === null) {
		return;
	}

	const height = window.innerHeight - bodyMarginVerticalHorizontal;
	const width = window.innerWidth - bodyMarginVerticalHorizontal;

	const layers = [];

	for (let i = 0; i < 3; i++) {
		const canvasDOMElement = document.createElement('canvas');
		canvasDOMElement.width = width;
		canvasDOMElement.height = height;
		canvasDOMElement.id = `layer-${i}`;
		canvasDOMElement.style.position = 'absolute';
		const domElementAppened = root.appendChild(canvasDOMElement);
		layers.push(
			domElementAppened.getContext('2d') as CanvasRenderingContext2D
		);
	}

	const game: Game = new Game(layers[0]);
	game.start();

	window.onresize = (): void => {
		const resizeWidth = window.innerWidth - bodyMarginVerticalHorizontal;
		const resizeHeight = window.innerHeight - bodyMarginVerticalHorizontal;

		game.resize(resizeWidth, resizeHeight);
	};
};
