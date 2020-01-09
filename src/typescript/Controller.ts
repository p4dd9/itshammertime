import GamepadManager from './GamepadManager';
import LudeCat from './LudeCat';
import {
	spriteSheetColumCount,
	spriteSheetRowCount,
} from '../config/ludeCatConfig';
import AudioManager from './AudioManager';
import CONTROLS from '../enums/controls';
import KEYCODES from '../enums/keycodes';
import { XBOX360_AXIS, XBOX360_BUTTONS } from '../enums/xbox360controls';
import ANIMATION from '../enums/spritesheets';
import LUDECATSTATE from '../enums/ludecatstate';

export default class Controller {
	private _controls: CONTROLS = CONTROLS.KEYBOARD;
	private gamepadManager = GamepadManager.getInstance();
	private ludeCat = LudeCat.getInstance();
	private moveDistance = 12;
	private axeStatusThreshold = 0.3;
	private _canvasHeight: number = 0;
	private _canvasWidth: number = 0;

	private static _instance: Controller;
	private constructor() {}

	public static getInstance(): Controller {
		if (!Controller._instance) {
			Controller._instance = new Controller();
		}
		return Controller._instance;
	}

	public get canvasHeight(): number {
		return this.canvasHeight;
	}

	public set canvasHeight(canvasHeight: number) {
		this._canvasHeight = canvasHeight;
	}

	public get canvasWidth(): number {
		return this._canvasWidth;
	}

	public set canvasWidth(canvasHeight: number) {
		this._canvasWidth = canvasHeight;
	}

	public get controls(): CONTROLS {
		return this._controls;
	}

	public set controls(controls: CONTROLS) {
		this._controls = controls;
	}

	public handleAxesInput() {
		const { gamepadManager, axeStatusThreshold } = this;
		if (
			gamepadManager!.axesStatus[XBOX360_AXIS.LS_X] > axeStatusThreshold
		) {
			this.moveRight();
		}
		if (
			gamepadManager!.axesStatus[XBOX360_AXIS.LS_X] < -axeStatusThreshold
		) {
			this.moveLeft();
		}
		if (
			gamepadManager!.axesStatus[XBOX360_AXIS.LS_Y] < -axeStatusThreshold
		) {
			this.moveUp();
		}
		if (
			gamepadManager!.axesStatus[XBOX360_AXIS.LS_Y] > axeStatusThreshold
		) {
			this.moveDown();
		}
	}

	private handleButtons() {
		const { gamepadManager, ludeCat } = this;
		if (gamepadManager?.gamepad?.buttons[XBOX360_BUTTONS.A].pressed) {
			ludeCat.spritesheet = ludeCat.spritesheets[ANIMATION.IDLE];
			AudioManager.meow();
		}

		if (gamepadManager?.gamepad?.buttons[XBOX360_BUTTONS.B].pressed) {
			AudioManager.nya();
		}

		if (gamepadManager?.gamepad?.buttons[XBOX360_BUTTONS.X].pressed) {
			AudioManager.meow2();
		}

		if (gamepadManager?.gamepad?.buttons[XBOX360_BUTTONS.X].pressed) {
			// ludeCat.spritesheet = ludeCat.spritesheets[1];
		}
	}

	private checkMovingCharacterByGamepad() {
		const { gamepadManager, ludeCat, axeStatusThreshold } = this;

		if (
			!(
				gamepadManager!.axesStatus[0] > axeStatusThreshold ||
				gamepadManager!.axesStatus[0] < -axeStatusThreshold ||
				gamepadManager!.axesStatus[1] > axeStatusThreshold ||
				gamepadManager!.axesStatus[1] < -axeStatusThreshold
			)
		) {
			ludeCat.moving(LUDECATSTATE.IDLE);
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
			this.moveRight();
		} else if (keyCode === KEYCODES.LEFT_ARROW) {
			this.moveLeft();
		} else if (keyCode === KEYCODES.UP_ARROW) {
			this.moveUp();
		} else if (keyCode === KEYCODES.DOWN_ARROW) {
			this.moveDown();
		} else {
			ludeCat.moving(LUDECATSTATE.IDLE);
		}
	}

	// TODO: Movement logic of LudeCat to LudeCat
	private moveRight() {
		const { ludeCat, moveDistance } = this;

		const destinationX =
			ludeCat.catPosition.x +
			ludeCat.spritesheet.width / spriteSheetColumCount +
			moveDistance;

		if (destinationX <= this._canvasWidth) {
			console.log('Left axe: right');
			ludeCat.moving(LUDECATSTATE.WALKING_RIGHT);
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
			ludeCat.moving(LUDECATSTATE.WALKING_LEFT);
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
			ludeCat.moving(LUDECATSTATE.WALKING_UP);
			ludeCat.catPosition.y += -moveDistance;
		} else {
			console.log('Moed out top.');
		}
	}

	private moveDown() {
		const { ludeCat, moveDistance } = this;

		const destinationY =
			ludeCat.catPosition.y +
			ludeCat.spritesheet.height / spriteSheetRowCount +
			moveDistance;
		if (destinationY < this._canvasHeight) {
			console.log('Left axe: down');
			ludeCat.moving(LUDECATSTATE.WALKING_UP);
			ludeCat.catPosition.y += moveDistance;
		} else {
			console.log('Moved out bottom.');
		}
	}
}
