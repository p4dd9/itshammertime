import GamepadManager from './input/GamepadManager';
import CONTROLS from '../enums/controls';
import LudeCat from './LudeCat';
import KeyboardManager from './input/KeyboardManager';
import Weapon from './Weapon';
import CursorManager from './input/CursorManager';

export default class Input {
	private _controls: CONTROLS = CONTROLS.KEYBOARD;

	private gamepadManager: GamepadManager;
	private keyboardManager: KeyboardManager;
	private cursorManager: CursorManager;

	constructor(
		ludecat: LudeCat,
		weapon: Weapon,
		context: CanvasRenderingContext2D
	) {
		this.gamepadManager = new GamepadManager(this, ludecat);
		this.keyboardManager = new KeyboardManager(this, weapon);
		this.cursorManager = new CursorManager(this, weapon, context);
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
		} else if (this._controls === CONTROLS.MOUSE) {
			this.cursorManager.handleMouse();
		} else {
			this.keyboardManager.handleArrowKeys();
		}
	}
}
