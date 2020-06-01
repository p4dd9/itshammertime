import 'whatwg-fetch';
import '../styles/video_overlay.scss';
import Game from '../typescript/Game';
import { injectCanvas } from '../util/commonUtil';

window.onload = (): void => {
	const contexts = injectCanvas();
	const game: Game = new Game(contexts);
	game.start();
};
