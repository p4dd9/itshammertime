import App from '../typescript/App';
import Controller from '../typescript/Controller';

const bodyMarginVerticalHorizontal = 16;

window.onload = (onLoadEvent: Event) => {
	const root: HTMLElement | null = document.getElementById('root');

	const height = window.innerHeight - bodyMarginVerticalHorizontal;
	const width = window.innerWidth - bodyMarginVerticalHorizontal;

	// TODO: create actual domelement
	const canvasDOMString = `<canvas id='canvas' width=${width} height=${height}></canvas>`;

	// root cannot be null
	root!.insertAdjacentHTML('beforeend', canvasDOMString);

	const canvas: HTMLElement | null = document.getElementById('canvas');
	const context: CanvasRenderingContext2D | null = (canvas as HTMLCanvasElement).getContext(
		'2d'
	);

	// TODO: Rename to game
	const app: App = new App(context!);

	Controller.getInstance().canvasHeight = height;
	Controller.getInstance().canvasWidth = width;
	app.initialize();
};

window.onresize = (onResize: Event) => {
	const canvas: HTMLElement | null = document.getElementById('canvas');

	if (canvas !== null) {
		(canvas as HTMLCanvasElement).width =
			window.innerWidth - bodyMarginVerticalHorizontal;
		(canvas as HTMLCanvasElement).height =
			window.innerHeight - bodyMarginVerticalHorizontal;

		Controller.getInstance().canvasHeight =
			window.innerHeight - bodyMarginVerticalHorizontal;
		Controller.getInstance().canvasWidth =
			window.innerWidth - bodyMarginVerticalHorizontal;
	} else {
		console.log('canvas element not found.');
	}
};
