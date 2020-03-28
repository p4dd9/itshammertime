import GamepadManager from './GamepadManager';
import CONTROLS from '../enums/controls';
import LudeCat from './LudeCat';
import KeyboardManager from './KeyboardManager';

export default class Input {
	private _controls: CONTROLS = CONTROLS.KEYBOARD;

	private _gamepadManager: GamepadManager;
	private _keyboardManager: KeyboardManager;

	constructor(ludecat: LudeCat) {
		this._gamepadManager = new GamepadManager(this, ludecat);
		this._keyboardManager = new KeyboardManager(this, ludecat);
	}

	public set controls(controls: CONTROLS) {
		this._controls = controls;
	}

	public get controls(): CONTROLS {
		return this._controls;
	}

	public handleInput(): void {
		if (this._controls === CONTROLS.GAMEPAD) {
			this._gamepadManager.checkMovingCharacterByGamepad();
			this._gamepadManager.handleButtons();
			this._gamepadManager.handleAxesInput();
		} else {
			this._keyboardManager.handleArrowKeys();
		}
	}
}
