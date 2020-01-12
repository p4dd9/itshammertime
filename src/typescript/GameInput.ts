import GamepadManager from './GamepadManager';
import CONTROLS from '../enums/controls';
import LudeCat from './LudeCat';
import KeyboardManager from './KeyboardManager';

export default class GameInput {
	private _gameInput: CONTROLS = CONTROLS.KEYBOARD;

	private _gamepadManager: GamepadManager;
	private _keyboardManager: KeyboardManager;

	constructor(ludecat: LudeCat) {
		this._gamepadManager = new GamepadManager(this, ludecat);
		this._keyboardManager = new KeyboardManager(this, ludecat);
	}

	public set controls(controls: CONTROLS) {
		this._gameInput = controls;
	}

	public get controls(): CONTROLS {
		return this._gameInput;
	}

	public handleInput() {
		if (this._gameInput === CONTROLS.GAMEPAD) {
			this._gamepadManager.checkMovingCharacterByGamepad();
			this._gamepadManager.handleButtons();
			this._gamepadManager.handleAxesInput();
		} else {
			this._keyboardManager.handleArrowKeys();
		}
	}
}
