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

	const contexts = [];

	for (let i = 0; i < 3; i++) {
		const canvas = document.createElement('canvas');
		canvas.width = width;
		canvas.height = height;
		canvas.id = `layer-${i}`;
		canvas.style.position = 'absolute';
		const domElementAppened = root.appendChild(canvas);
		contexts.push(
			domElementAppened.getContext('2d') as CanvasRenderingContext2D
		);
	}

	const game: Game = new Game(contexts);
	game.start();

	window.onresize = (): void => {
		const resizeWidth = window.innerWidth - bodyMarginVerticalHorizontal;
		const resizeHeight = window.innerHeight - bodyMarginVerticalHorizontal;

		game.resize(resizeWidth, resizeHeight);
	};
};
