import GamepadManager from './GamepadManager';
import LudeCat from './LudeCat';
import {
	spriteSheetSubRetangleWidth,
	spriteSheetSubRetangleHeight,
} from '../config/ludeCatConfig';
import AudioManager from './AudioManager';

export default class Controller {
	public static handleControllerInput(
		canvasHeight: number,
		canvasWidth: number
	) {
		const gamepadManager = GamepadManager.getInstance();
		const ludeCat = LudeCat.getInstance();
		const moveDistance = 20;

		if (gamepadManager?.gamepad?.buttons[0].pressed) {
			ludeCat.spritesheet = ludeCat.spritesheets[0];
			AudioManager.meow();
		}

		if (gamepadManager?.gamepad?.buttons[1].pressed) {
			AudioManager.nya();
		}

		if (gamepadManager?.gamepad?.buttons[2].pressed) {
			AudioManager.meow2();
		}

		if (gamepadManager?.gamepad?.buttons[2].pressed) {
			ludeCat.spritesheet = ludeCat.spritesheets[1];
		}

		if (
			gamepadManager!.axesStatus[0] > 0.5 ||
			gamepadManager!.axesStatus[0] < -0.5 ||
			gamepadManager!.axesStatus[1] > 0.5 ||
			gamepadManager!.axesStatus[1] < -0.5
		) {
			ludeCat.moving = true;
		} else {
			ludeCat.moving = false;
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
