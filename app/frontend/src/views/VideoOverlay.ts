import 'whatwg-fetch';
import '../styles/video_overlay.scss';
import Game from '../typescript/Game';
import { create2DRenderingContexts } from '../util/commonUtil';

window.onload = (): void => {
	const contexts = create2DRenderingContexts();
	new Game(contexts);
	// game.start();
};
