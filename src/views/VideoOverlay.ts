import App from '../typescript/App';
import Controller from '../typescript/Controller';

window.onload = (onLoadEvent: Event) => {
	const root: HTMLElement | null = document.getElementById('root');

	const height = window.innerHeight;
	const width = window.innerWidth;

	const canvasDOMString = `<canvas id='canvas' width=${width} height=${height}></canvas>`;

	if (root !== null) {
		root.insertAdjacentHTML('beforeend', canvasDOMString);

		const app: App = new App(height, width);
		app.initialize();
	} else {
		console.log('root element not found.');
	}
};

window.onresize = (onResize: Event) => {
	const canvas: HTMLElement | null = document.getElementById('canvas');

	if (canvas !== null) {
		(canvas as HTMLCanvasElement).width = window.innerWidth;
		(canvas as HTMLCanvasElement).height = window.innerHeight;

		Controller.getInstance().canvasHeight = window.innerWidth;
		Controller.getInstance().canvasWidth = window.innerHeight;
	} else {
		console.log('canvas element not found.');
	}
};
