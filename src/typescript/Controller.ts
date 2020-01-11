import GamepadManager from './GamepadManager';
import CONTROLS from '../enums/controls';
import KEYCODES from '../enums/keycodes';
import { XBOX360_AXIS, XBOX360_BUTTONS } from '../enums/xbox360controls';
import LUDECATSTATE from '../enums/ludecatstate';
import LudeCat from './LudeCat';

export default class Controller {
	// Currently used controls
	private _controls: CONTROLS = CONTROLS.KEYBOARD;

	// Character instance
	private _ludeCat: LudeCat;

	// Controller
	private _gamepadManager: GamepadManager;
	private _axeStatusThreshold = 0.3;

	// Keyboard
	private _rightArrowKeyPressed = false;
	private _leftArrowKeyPressed = false;
	private _upArrowKeyPressed = false;
	private _downArrowKeyPressed = false;

	constructor(_ludeCat: LudeCat) {
		this.addKeyboardListenerToDocument();
		this._gamepadManager = new GamepadManager(this);
		this._ludeCat = _ludeCat;
	}

	public set controls(controls: CONTROLS) {
		this._controls = controls;
	}

	public handleAxesInput() {
		const { _gamepadManager, _axeStatusThreshold, _ludeCat } = this;
		if (
			_gamepadManager.axesStatus[XBOX360_AXIS.LS_X] > _axeStatusThreshold
		) {
			_ludeCat.moveRight();
		}
		if (
			_gamepadManager.axesStatus[XBOX360_AXIS.LS_X] < -_axeStatusThreshold
		) {
			_ludeCat.moveLeft();
		}
		if (
			_gamepadManager.axesStatus[XBOX360_AXIS.LS_Y] < -_axeStatusThreshold
		) {
			_ludeCat.moveUp();
		}
		if (
			_gamepadManager.axesStatus[XBOX360_AXIS.LS_Y] > _axeStatusThreshold
		) {
			_ludeCat.moveDown();
		}
	}

	private handleButtons() {
		const { _gamepadManager, _ludeCat } = this;
		if (_gamepadManager.gamepad?.buttons[XBOX360_BUTTONS.A].pressed) {
			_ludeCat.meow();
		}

		if (_gamepadManager.gamepad?.buttons[XBOX360_BUTTONS.B].pressed) {
			_ludeCat.nya();
		}

		if (_gamepadManager.gamepad?.buttons[XBOX360_BUTTONS.X].pressed) {
			_ludeCat.meow2();
		}
	}

	private checkMovingCharacterByGamepad() {
		const { _gamepadManager, _ludeCat, _axeStatusThreshold } = this;

		if (
			!(
				_gamepadManager.axesStatus[XBOX360_AXIS.LS_X] >
					_axeStatusThreshold ||
				_gamepadManager.axesStatus[XBOX360_AXIS.LS_X] <
					-_axeStatusThreshold ||
				_gamepadManager.axesStatus[XBOX360_AXIS.LS_Y] >
					_axeStatusThreshold ||
				_gamepadManager.axesStatus[XBOX360_AXIS.LS_Y] <
					-_axeStatusThreshold
			)
		) {
			_ludeCat.moving(LUDECATSTATE.IDLE);
		}
	}

	public handleInput() {
		if (this._controls === CONTROLS.GAMEPAD) {
			this.checkMovingCharacterByGamepad();
			this.handleButtons();
			this.handleAxesInput();
		} else {
			this.handleArrowKeys();
		}
	}

	private handleArrowKeys() {
		if (this._rightArrowKeyPressed) {
			this._ludeCat.moveRight();
		} else if (this._leftArrowKeyPressed) {
			this._ludeCat.moveLeft();
		} else if (this._upArrowKeyPressed) {
			this._ludeCat.moveUp();
		} else if (this._downArrowKeyPressed) {
			this._ludeCat.moveDown();
		} else {
			this._ludeCat.moving(LUDECATSTATE.IDLE);
		}
	}

	private detectKey(keyCode: number, pressed: boolean) {
		if (keyCode === KEYCODES.RIGHT_ARROW) {
			this._rightArrowKeyPressed = pressed;
		} else if (keyCode === KEYCODES.LEFT_ARROW) {
			this._leftArrowKeyPressed = pressed;
		} else if (keyCode === KEYCODES.UP_ARROW) {
			this._upArrowKeyPressed = pressed;
		} else if (keyCode === KEYCODES.DOWN_ARROW) {
			this._downArrowKeyPressed = pressed;
		}
	}

	public addKeyboardListenerToDocument() {
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (this._controls === CONTROLS.KEYBOARD) {
				this.detectKey(e.keyCode, true);
			}
		});

		document.addEventListener('keyup', (e: KeyboardEvent) => {
			if (this._controls === CONTROLS.KEYBOARD) {
				this.detectKey(e.keyCode, false);
			}
		});
	}
}
