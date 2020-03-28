import GamepadManager from './GamepadManager';
import CONTROLS from '../enums/controls';
import LudeCat from './LudeCat';
import KeyboardManager from './KeyboardManager';

export default class Input {
	private _controls: CONTROLS = CONTROLS.KEYBOARD;

	private gamepadManager: GamepadManager;
	private keyboardManager: KeyboardManager;

	constructor(ludecat: LudeCat) {
		this.gamepadManager = new GamepadManager(this, ludecat);
		this.keyboardManager = new KeyboardManager(this, ludecat);
	}

	public set controls(controls: CONTROLS) {
		this._controls = controls;
	}

	public get controls(): CONTROLS {
		return this._controls;
	}

	public handleInput(): void {
		const gamepadManager = this.gamepadManager;

		if (this._controls === CONTROLS.GAMEPAD) {
			gamepadManager.checkMovingCharacterByGamepad();
			gamepadManager.handleButtons();
			gamepadManager.handleAxesInput();
		} else {
			this.keyboardManager.handleArrowKeys();
		}
	}
}
