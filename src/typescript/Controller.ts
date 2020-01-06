import GamepadManager from './GamepadManager';
import LudeCat from './LudeCat';
import {
	spriteSheetSubRetangleWidth,
	spriteSheetSubRetangleHeight,
} from '../config/ludeCatConfig';
import AudioManager from './AudioManager';
import CONTROLS from '../enums/controls';
import KEYCODES from '../enums/keycodes';

export default class Controller {
	private _controls: CONTROLS = CONTROLS.KEYBOARD;
	private gamepadManager = GamepadManager.getInstance();
	private ludeCat = LudeCat.getInstance();
	private moveDistance = 12;
	private axeStatusThreshold = 0.3;
	public canvasHeight: number = 0;
	public canvasWidth: number = 0;

	private static _instance: Controller;
	private constructor() {}

	public static getInstance(): Controller {
		if (!Controller._instance) {
			Controller._instance = new Controller();
		}

		return Controller._instance;
	}

	public get controls(): CONTROLS {
		return this._controls;
	}

	public set controls(controls: CONTROLS) {
		this._controls = controls;
	}

	public handleAxesInput() {
		const { gamepadManager, axeStatusThreshold } = this;
		if (gamepadManager!.axesStatus[0] > axeStatusThreshold) {
			this.moveRight();
		}
		if (gamepadManager!.axesStatus[0] < -axeStatusThreshold) {
			this.moveLeft();
		}
		if (gamepadManager!.axesStatus[1] < -axeStatusThreshold) {
			this.moveUp();
		}
		if (gamepadManager!.axesStatus[1] > axeStatusThreshold) {
			this.moveDown();
		}
	}

	private handleButtons() {
		const { gamepadManager, ludeCat } = this;
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
	}

	private checkMovingCharacterByGamepad() {
		const { gamepadManager, ludeCat, axeStatusThreshold } = this;

		if (
			gamepadManager!.axesStatus[0] > axeStatusThreshold ||
			gamepadManager!.axesStatus[0] < -axeStatusThreshold ||
			gamepadManager!.axesStatus[1] > axeStatusThreshold ||
			gamepadManager!.axesStatus[1] < -axeStatusThreshold
		) {
			ludeCat.moving = true;
		} else {
			ludeCat.moving = false;
		}
	}

	public handleControllerInput() {
		if (this._controls === CONTROLS.GAMEPAG) {
			this.checkMovingCharacterByGamepad();
			this.handleButtons();
			this.handleAxesInput();
		}
	}

	public handleKeyBoardControls(keyCode: number) {
		if (this._controls === CONTROLS.KEYBOARD) {
			this.handleKeyBoardArrows(keyCode);
		}
	}

	private handleKeyBoardArrows(keyCode: number) {
		const { ludeCat } = this;

		if (keyCode === KEYCODES.RIGHT_ARROW) {
			ludeCat.moving = true;
			this.moveRight();
		} else if (keyCode === KEYCODES.LEFT_ARROW) {
			ludeCat.moving = true;
			this.moveLeft();
		} else if (keyCode === KEYCODES.UP_ARROW) {
			ludeCat.moving = true;
			this.moveUp();
		} else if (keyCode === KEYCODES.DOWN_ARROW) {
			this.moveDown();
			ludeCat.moving = true;
		} else {
			ludeCat.moving = false;
		}
	}

	private moveRight() {
		const { ludeCat, moveDistance } = this;

		const destinationX =
			ludeCat.catPosition.x + spriteSheetSubRetangleWidth + moveDistance;
		if (destinationX <= this.canvasWidth) {
			console.log('Left axe: right');
			ludeCat.catPosition.x += moveDistance;
		} else {
			console.log('Moved out right');
		}
	}

	private moveLeft() {
		const { ludeCat, moveDistance } = this;

		const destinationX = ludeCat.catPosition.x - moveDistance;
		if (destinationX >= 0) {
			console.log('Left axe: left');
			ludeCat.catPosition.x += -moveDistance;
		} else {
			console.log('Moved out left');
		}
	}

	private moveUp() {
		const { ludeCat, moveDistance } = this;

		const destinationY = ludeCat.catPosition.y - moveDistance;

		if (destinationY >= 0) {
			console.log('Left axe: up');
			ludeCat.catPosition.y += -moveDistance;
		} else {
			console.log('Moed out top.');
		}
	}

	private moveDown() {
		const { ludeCat, moveDistance } = this;

		const destinationY =
			ludeCat.catPosition.y + spriteSheetSubRetangleHeight + moveDistance;
		if (destinationY < this.canvasHeight) {
			console.log('Left axe: down');
			ludeCat.catPosition.y += moveDistance;
		} else {
			console.log('Moved out bottom.');
		}
	}
}
