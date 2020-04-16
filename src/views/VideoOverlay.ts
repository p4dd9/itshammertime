import '../styles/video_overlay.scss';
import Game from '../typescript/Game';
import { getRenderingContextsFromDOM } from '../util/commonUtil';

window.onload = (): void => {
	const contexts = getRenderingContextsFromDOM();
	const game: Game = new Game(contexts);
	game.start();
};
