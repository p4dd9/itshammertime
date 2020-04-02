import GamepadManager from './input/GamepadManager';
import CONTROLS from '../enums/controls';
import KeyboardManager from './input/KeyboardManager';
import Weapon from './Weapon';
import CursorManager from './input/CursorManager';

export default class Input {
	private _controls: CONTROLS = CONTROLS.KEYBOARD;

	private gamepadManager: GamepadManager;
	private keyboardManager: KeyboardManager;
	private cursorManager: CursorManager;

	constructor(weapon: Weapon, context: CanvasRenderingContext2D) {
		this.gamepadManager = new GamepadManager(this, weapon);
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

		gamepadManager.checkMovingCharacterByGamepad();
		gamepadManager.handleButtons();
		gamepadManager.handleAxesInput();
		this.cursorManager.handleMouse();
		this.keyboardManager.handleArrowKeys();
	}
}
