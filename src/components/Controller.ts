import GamepadManager from './GamepadManager';
import LudeCat from './LudeCat';
import {
	spriteSheetSubRetangleWidth,
	spriteSheetSubRetangleHeight,
} from '../config/ludeCatConfig';
import AudioManager from './AudioManager';

const moveDistance = 25;

export default class Controller {
	public static handleControllerInput(
		canvasHeight: number,
		canvasWidth: number
	) {
		const gamepadManager = GamepadManager.getInstance();
		const ludeCat = LudeCat.getInstance();

		if (gamepadManager?.gamepad?.buttons[0].pressed) {
			AudioManager.meow();
		}

		if (gamepadManager!.axesStatus[0] > 0.5) {
			const destinationX =
				ludeCat.catPosition.x +
				spriteSheetSubRetangleWidth +
				moveDistance;
			if (destinationX <= canvasWidth) {
				console.log('Left axe: right');
				ludeCat.catPosition.x += moveDistance;
			} else {
				console.log('Moved out right');
			}
		}
		if (gamepadManager!.axesStatus[0] < -0.5) {
			const destinationX = ludeCat.catPosition.x - moveDistance;
			if (destinationX >= 0) {
				console.log('Left axe: left');
				ludeCat.catPosition.x += -moveDistance;
			} else {
				console.log('Moved out left');
			}
		}
		if (gamepadManager!.axesStatus[1] > 0.5) {
			const destinationY =
				ludeCat.catPosition.y +
				spriteSheetSubRetangleHeight +
				moveDistance;
			if (destinationY < canvasHeight) {
				console.log('Left axe: down');
				ludeCat.catPosition.y += moveDistance;
			} else {
				console.log('Moved out bottom.');
			}
		}
		if (gamepadManager!.axesStatus[1] < -0.5) {
			const destinationY = ludeCat.catPosition.y - moveDistance;

			if (destinationY >= 0) {
				console.log('Left axe: up');
				ludeCat.catPosition.y += -moveDistance;
			} else {
				console.log('Moed out top.');
			}
		}
	}
}
