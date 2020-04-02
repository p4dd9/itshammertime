import GamepadManager from './input/GamepadManager';
import CONTROL_TYPE from '../enums/controls';
import KeyboardManager from './input/KeyboardManager';
import Weapon from './Weapon';
import CursorManager from './input/CursorManager';

export default class Controller {
	private controllerType: CONTROL_TYPE = CONTROL_TYPE.KEYBOARD;

	private gamepadManager: GamepadManager;
	private keyboardManager: KeyboardManager;
	private cursorManager: CursorManager;

	constructor(weapon: Weapon, context: CanvasRenderingContext2D) {
		this.gamepadManager = new GamepadManager(this, weapon);
		this.keyboardManager = new KeyboardManager(this, weapon);
		this.cursorManager = new CursorManager(this, weapon, context);
	}

	public set controls(controllerType: CONTROL_TYPE) {
		this.controllerType = controllerType;
	}

	public get controls(): CONTROL_TYPE {
		return this.controllerType;
	}

	public handleInput(): void {
		this.gamepadManager.handleInput();
		this.cursorManager.handleInput();
		this.keyboardManager.handleInput();
	}
}
