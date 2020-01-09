import Game from '../typescript/Game';

const bodyMarginVerticalHorizontal = 16;

window.onload = (onLoadEvent: Event) => {
	const root: HTMLElement | null = document.getElementById('root');

	const height = window.innerHeight - bodyMarginVerticalHorizontal;
	const width = window.innerWidth - bodyMarginVerticalHorizontal;

	const canvasDOMElement = document.createElement('canvas');
	canvasDOMElement.width = width;
	canvasDOMElement.height = height;

	root!.appendChild(canvasDOMElement);

	const context: CanvasRenderingContext2D | null = canvasDOMElement.getContext(
		'2d'
	);

	const game: Game = new Game(context!);
	game.start();

	window.onresize = (onResize: Event) => {
		const resizeWidth = window.innerWidth - bodyMarginVerticalHorizontal;
		const resizeHeight = window.innerHeight - bodyMarginVerticalHorizontal;

		game.resize(resizeWidth, resizeHeight);
	};
};
