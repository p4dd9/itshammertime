import App from '../typescript/App';
import Controller from '../typescript/Controller';

const bodyMarginVerticalHorizontal = 16;

window.onload = (onLoadEvent: Event) => {
	const root: HTMLElement | null = document.getElementById('root');

	const height = window.innerHeight - bodyMarginVerticalHorizontal;
	const width = window.innerWidth - bodyMarginVerticalHorizontal;

	const canvasDOMString = `<canvas id='canvas' width=${width} height=${height}></canvas>`;

	if (root !== null) {
		root.insertAdjacentHTML('beforeend', canvasDOMString);

		const app: App = new App();
		Controller.getInstance().canvasHeight = height;
		Controller.getInstance().canvasWidth = width;
		app.initialize();
	} else {
		console.log('root element not found.');
	}
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
