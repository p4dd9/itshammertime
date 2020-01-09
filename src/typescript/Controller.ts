import GamepadManager from './GamepadManager';
import AudioManager from './AudioManager';
import CONTROLS from '../enums/controls';
import KEYCODES from '../enums/keycodes';
import { XBOX360_AXIS, XBOX360_BUTTONS } from '../enums/xbox360controls';
import LUDECATSTATE from '../enums/ludecatstate';
import LudeCat from './LudeCat';

export default class Controller {
	private _controls: CONTROLS = CONTROLS.KEYBOARD;
	private _gamepadManager: GamepadManager;
	private _axeStatusThreshold = 0.3;
	private _ludeCat: LudeCat;

	constructor(ludeCat: LudeCat) {
		this.addKeyboardListenerToDocument();
		this._gamepadManager = new GamepadManager(this);
		this._ludeCat = ludeCat;
	}

	public set controls(controls: CONTROLS) {
		this._controls = controls;
	}

	public handleAxesInput() {
		const {
			_gamepadManager: gamepadManager,
			_axeStatusThreshold: axeStatusThreshold,
			_ludeCat: ludeCat,
		} = this;
		if (
			gamepadManager!.axesStatus[XBOX360_AXIS.LS_X] > axeStatusThreshold
		) {
			ludeCat.moveRight();
		}
		if (
			gamepadManager!.axesStatus[XBOX360_AXIS.LS_X] < -axeStatusThreshold
		) {
			ludeCat.moveLeft();
		}
		if (
			gamepadManager!.axesStatus[XBOX360_AXIS.LS_Y] < -axeStatusThreshold
		) {
			ludeCat.moveUp();
		}
		if (
			gamepadManager!.axesStatus[XBOX360_AXIS.LS_Y] > axeStatusThreshold
		) {
			ludeCat.moveDown();
		}
	}

	private handleButtons() {
		const { _gamepadManager: gamepadManager } = this;
		if (gamepadManager?.gamepad?.buttons[XBOX360_BUTTONS.A].pressed) {
			AudioManager.meow();
		}

		if (gamepadManager?.gamepad?.buttons[XBOX360_BUTTONS.B].pressed) {
			AudioManager.nya();
		}

		if (gamepadManager?.gamepad?.buttons[XBOX360_BUTTONS.X].pressed) {
			AudioManager.meow2();
		}
	}

	private checkMovingCharacterByGamepad() {
		const {
			_gamepadManager: gamepadManager,
			_ludeCat: ludeCat,
			_axeStatusThreshold: axeStatusThreshold,
		} = this;

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
		if (this._controls === CONTROLS.GAMEPAD) {
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
		const { _ludeCat: ludeCat } = this;

		if (keyCode === KEYCODES.RIGHT_ARROW) {
			ludeCat.moveRight();
		} else if (keyCode === KEYCODES.LEFT_ARROW) {
			ludeCat.moveLeft();
		} else if (keyCode === KEYCODES.UP_ARROW) {
			ludeCat.moveUp();
		} else if (keyCode === KEYCODES.DOWN_ARROW) {
			ludeCat.moveDown();
		} else {
			ludeCat.moving(LUDECATSTATE.IDLE);
		}
	}

	public addKeyboardListenerToDocument() {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			this.handleKeyBoardControls(e.keyCode);
		});
	}
}
